import { WebexCall, WebexInstanceSkel, WebexMessage } from './webex'
import WebSocket = require('ws')
import { CompanionActionEvent, CompanionConfigField, CompanionSystem,	CompanionFeedbackEvent,
	CompanionFeedbackResult } from '../../../instance_skel_types'
import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'
import { ExecuteFeedback, FeedbackId, GetFeedbacksList } from './feedback'
import { GetPresetsList } from './presets'
import { InitVariables } from './variables'

// DEBUG ONLY!!!!!!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

class ControllerInstance extends WebexInstanceSkel<DeviceConfig> {
	// private socket: Socket | undefined
	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)
	}

	public init(): void {
		this.status(this.STATUS_UNKNOWN)
		this.updateConfig(this.config)
	}

	// Override base types to make types stricter
	public checkFeedbacks(feedbackId?: FeedbackId, ignoreInitDone?: boolean): void {
		if (ignoreInitDone) {
			super.checkFeedbacks(feedbackId)
		}
	}
	public initWebSocket(): void {
		if (this.websocket !== undefined) {
			this.websocket.close()
			this.websocket = undefined
			InitVariables(this)
		}

		if (this.config.host) {
			console.log(`Connecting to ${this.config.host} via WebSocket`)
			const { host, username, password } = this.config
			// Check for empty/undefined first?

			this.websocket = new WebSocket(`wss://${host}/ws`, {
				headers: {
					Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
				}
			})
			this.status(this.STATUS_WARNING, 'Connecting')

			this.websocket.on('open', () => {
				console.log('Connection has been established.')
				this.status(this.STATUS_OK, 'Ready')
				let enableFeedbackConfiguration = {
					jsonrpc: '2.0',
					id: '113',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Configuration'], NotifyCurrentValue: true }
				}
				let enableFeedbackTime = {
					jsonrpc: '2.0',
					id: '114',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Status', 'Time', 'SystemTime'], NotifyCurrentValue: true }
				}
				let enableFeedbackCall = {
					jsonrpc: '2.0',
					id: '115',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Status', 'Call'], NotifyCurrentValue: true }
				}
				let enableFeedbackAudio = {
					jsonrpc: '2.0',
					id: '116',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Status', 'Audio'], NotifyCurrentValue: true }
				}
				let enableFeedbackDoNotDisturb = {
					jsonrpc: '2.0',
					id: '117',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Status', 'Conference'], NotifyCurrentValue: true }
				}
				let enableFeedbackMainVideoSource = {
					jsonrpc: '2.0',
					id: '118',
					method: 'xFeedback/Subscribe',
					params: { Query: ['Status', 'Video', 'Input', 'MainVideoSource'], NotifyCurrentValue: true }
				}

				this.websocket?.send(JSON.stringify(enableFeedbackConfiguration))
				this.websocket?.send(JSON.stringify(enableFeedbackTime))
				this.websocket?.send(JSON.stringify(enableFeedbackCall))
				this.websocket?.send(JSON.stringify(enableFeedbackAudio))
				this.websocket?.send(JSON.stringify(enableFeedbackDoNotDisturb))
				this.websocket?.send(JSON.stringify(enableFeedbackMainVideoSource))
			})
			this.websocket.on('message', (data: WebexMessage) => {
				this.processJSON(data)
			})
			this.websocket.on('close', () => {
				console.log('Connection closed')
				this.status(this.STATUS_WARNING, 'Connection closed by server')
			})
			this.websocket.on('error', (err: string) => {
				console.log('Error:', err)
				this.status(this.STATUS_ERROR, 'Connection error')
				this.log('error', 'Cisco Webex error: ' + err)
			})
		}
	}

	private processJSON(msg: WebexMessage): void {
		let message = JSON.parse(msg.toString())
		if (message.method == 'xFeedback/Event') {
			if (message.params.Status != undefined) {
				let status = message.params.Status
				if (status.Audio != undefined) {
					if (status.Audio.SelectedDevice != null) this.setVariable('selected_device', status.Audio.SelectedDevice)

					if (status.Audio.Input !=undefined && status.Audio.Input.Connectors != undefined && status.Audio.Input.Connectors.Microphone != undefined) {
						let muteState = ''
						for (let index = 0; index < status.Audio.Input.Connectors.Microphone.length; index++) {
							const element = status.Audio.Input.Connectors.Microphone[index];
							muteState += `(Mic ${element.id} Mute: ${element.Mute})`
							this.connectorMute[element.id] = element.Mute
						}
						this.setVariable('audio_connector_mute', muteState)
					}
					if (status.Audio.Volume != null) this.setVariable('volume', status.Audio.Volume)
					if (status.Audio.Microphones != undefined && status.Audio.Microphones.MusicMode != undefined)
						this.setVariable('microphones_musicmode', status.Audio.Microphones.MusicMode)
					if (status.Audio.Microphones != undefined && status.Audio.Microphones.Mute != undefined)
						this.setVariable('microphones_mute', status.Audio.Microphones.Mute)
				}
				else if (status.Call != undefined) {
					this.ongoingCalls.length = 0
					let outgoing = 0
					let incoming = 0
					let incoming_ringing = 0

					status.Call.forEach((call: WebexCall) => {
						this.ongoingCalls.push(call)
						if(call.Direction == 'Outgoing') {
							outgoing ++
						} 
						if(call.Direction == 'Incoming') {
							incoming ++
						} 
						if(call.Status == 'Ringing') {
							incoming_ringing ++
						}
						this.setVariable('outgoing_calls', outgoing.toString())
						this.setVariable('ingoing_calls', incoming.toString())
						this.setVariable('ingoing_ringing_calls', incoming_ringing.toString())
						outgoing > 0 ? this.hasOutgoingCall = true : this.hasOutgoingCall = false
						incoming > 0 ? this.hasIngoingCall = true : this.hasIngoingCall = false
						incoming_ringing > 0 ? this.hasRingingCall = true : this.hasRingingCall = false
						this.checkFeedbacks(FeedbackId.Ringing)
						this.checkFeedbacks(FeedbackId.HasIngoingCall)
						this.checkFeedbacks(FeedbackId.HasOutgoingCall)
					})

					console.log(this.ongoingCalls)
				}
				else if (status.Time != undefined) {
					if (status.Time.SystemTime != null) {
						// let dateTime = new Date(status.Time.SystemTime)
						// let showMsg = `${dateTime.getHours}:${dateTime.getMinutes} ${dateTime.getDay}-${dateTime.getMonth}-${dateTime.getFullYear}`
						this.setVariable('systemtime', status.Time.SystemTime)
					}
				}
				else if (status.Conference != undefined) {
					if (status.Conference.DoNotDisturb != null) {
						this.setVariable('DoNotDisturb', status.Conference.DoNotDisturb)
					}
					if (status.Conference.Presentation != null) {
						this.setVariable('Presentation', status.Conference.Presentation)
					}
					if (status.Conference.SelectedCallProtocol != null) {
						this.setVariable('SelectedCallProtocol', status.Conference.SelectedCallProtocol)
					}
				}
				else if (status.Video != undefined && status.Video.Input != undefined) {
					console.log('status video input:',status.Video.Input);
					if (status.Video.Input.MainVideoSource != null) {
						this.setVariable('MainVideoSource', status.Video.Input.MainVideoSource)
					}
					// if (status.Video.Input.Source [n] ConnectorId != null) {
					// 	this.setVariable('Source [n] ConnectorId', status.Video.Input.Source [n] ConnectorId)
					// }
				}
				else {
					console.log('feedback:',status);
				}
			}
			if (
				message.params.Configuration != undefined &&
				message.params.Configuration.Conference != undefined &&
				message.params.Configuration.Conference.AutoAnswer != undefined
			) {
				let AutoAnswer = message.params.Configuration.Conference.AutoAnswer
				if (AutoAnswer.Mode != null)
					this.setVariable('autoanswer_mode', message.params.Configuration.Conference.AutoAnswer.Mode)
				if (AutoAnswer.Mute != null)
					this.setVariable('autoanswer_mute', message.params.Configuration.Conference.AutoAnswer.Mute)
				if (AutoAnswer.Delay != null)
					this.setVariable('autoanswer_delay', message.params.Configuration.Conference.AutoAnswer.Delay)
			}
		} else {
			console.log('message:', message)
		}
	}
	/**
	 * Process an updated configuration array.
	 *
	 * @param {DeviceConfig} config
	 * @memberof ControllerInstance
	 */
	public updateConfig(config: DeviceConfig): void {
		this.config = config
		this.setActions(GetActionsList(this))
		InitVariables(this)
		this.initWebSocket()
		this.setPresetDefinitions(GetPresetsList(this))
		this.setFeedbackDefinitions(GetFeedbacksList(this))
	}

	public action(action: CompanionActionEvent): void {
		HandleAction(this, action)
	}

	/**
	 * Creates the configuration fields for web config.
	 */
	// eslint-disable-next-line @typescript-eslint/camelcase
	public config_fields(): CompanionConfigField[] {
		return GetConfigFields(this)
	}

	/**
	 * Clean up the instance before it is destroyed.
	 */
	public destroy(): void {
		this.debug('destroy', this.id)
		this.websocket?.close()
	}

	/**
	 * Processes a feedback state.
	 */
	public feedback(feedback: CompanionFeedbackEvent): CompanionFeedbackResult {
	if (this.websocket !== undefined) {
		return ExecuteFeedback(this, feedback)
	}

	return {}
}
}

export = ControllerInstance
