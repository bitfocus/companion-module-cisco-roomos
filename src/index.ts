import { WebexInstanceSkel, WebexOnOffBoolean, WebexConfigAutoAnswer } from './webex'
import { connect as XAPIConnect } from 'jsxapi'

import {
	CompanionActionEvent,
	CompanionConfigField,
	CompanionSystem,
	CompanionFeedbackEvent,
	CompanionFeedbackResult
} from '../../../instance_skel_types'
import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'
import { ExecuteFeedback, FeedbackId, GetFeedbacksList, HandleXAPIConfFeedback, HandleXAPIFeedback } from './feedback'
import { GetPresetsList } from './presets'
import { InitVariables } from './variables'

class ControllerInstance extends WebexInstanceSkel<DeviceConfig> {
	private connected: boolean
	private connecting: boolean
	private timer?: NodeJS.Timer

	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)

		this.connected = false
		this.connecting = false
	}

	public init(): void {
		this.status(this.STATUS_UNKNOWN)
		this.updateConfig(this.config)
		this.timer = setInterval(() => this.tick(), 5000)
	}
	/**
	 * INTERNAL: Setup connection
	 *
	 * @access protected
	 */
	public tick(): void {
		if (!this.connected)
			console.log('Tick:', { connected: this.connected, connecting: this.connecting, host: this.config?.host })
		if (!this.connected && !this.connecting) {
			if (this.config?.host) {
				this.initSSH()
			}
		}
	}
	// Override base types to make types stricter
	public checkFeedbacks(...feedbackTypes: FeedbackId[]): void {
		super.checkFeedbacks(...feedbackTypes)
	}
	/**
	 * Setup connection for SSH connection
	 */
	public initSSH(): void {
		if (this.xapi !== undefined) {
			this.xapi.close()
			this.xapi = undefined
			this.reset()
			InitVariables(this)
		}

		try {
			const { host, username, password, protocol } = this.config
			this.xapi = XAPIConnect(`${protocol}://` + host, {
				username,
				password
			})

			this.connecting = true
			this.status(this.STATUS_WARNING, 'Connecting')

			this.xapi.on('error', (error) => {
				this.status(this.STATUS_ERROR, 'Connection error')
				this.log('error', 'Cisco Webex error: ' + error)
				this.xapi = undefined
				this.connected = false
				this.connecting = false
				this.reset()
			})

			this.xapi.on('ready', () => {
				// console.log('ready THIS:', this)
				this.status(this.STATUS_OK, 'Ready')
				this.connected = true
				this.checkFeedbacks()

				this.xapi?.config.get('Conference AutoAnswer').then((value) => {
					if (value?.Mode) {
						if (value?.Mode != null) this.setVariable('autoanswer_mode', value.Mode)
						if (value?.Mute != null) this.setVariable('autoanswer_mute', value.Mute)
						if (value?.Delay != null) this.setVariable('autoanswer_delay', value.Delay)
						this.autoAnswerConfig = value as WebexConfigAutoAnswer
					}
				})
				this.xapi?.Status.Conference.get().then((value: any) => {
					if (value.DoNotDisturb != null) {
						this.setVariable('DoNotDisturb', value.DoNotDisturb)
					}
					if (value.Presentation != null) {
						this.setVariable('Presentation', value.Presentation.CallId + value.Presentation.Mode)
					}
					if (value.SelectedCallProtocol != null) {
						this.setVariable('SelectedCallProtocol', value.SelectedCallProtocol)
					}
				})

				this.xapi?.Status.Time.SystemTime.get().then((time: Date) => {
					this.setVariable('systemtime', time.toString())
				})
				this.xapi?.Status.Audio.SelectedDevice.get().then((value: any) => {
					console.log('AUDIO SELECTED DEVICE:', value)
					this.setVariable('selected_device', value.SelectedDevice)
				})
				this.xapi?.Status.Audio.get().then((value: any) => {
					let muteState = ''
					for (let index = 0; index < value.Input.Connectors.Microphone.length; index++) {
						const element = value.Input.Connectors.Microphone[index]
						muteState += `(Mic ${element.id} Mute: ${element.Mute})`
						this.connectorMute[element.id] = element.Mute
					}
					this.setVariable('audio_connector_mute', muteState)
					this.setVariable('volume', value.Volume)
					this.setVariable('microphones_musicmode', value.Microphones.MusicMode)
					this.setVariable('microphones_mute', value.Microphones.Mute)
					this.microphoneMute = value.Microphones.Mute == 'On' ? true : false
					this.checkFeedbacks(FeedbackId.MicrophoneMute)
				})
			})

			this.xapi.feedback.on('Status', (event) => HandleXAPIFeedback(this, event))
			this.xapi.feedback.on('Configuration', (event) => HandleXAPIConfFeedback(this, event))
		} catch (e) {
			this.log('error', 'Error connecting to webex device: ' + e.message)
			this.xapi = undefined
			this.connected = false
			this.connecting = true
			this.reset()
		}
	}

	/**
	 * INTERNAL: Reset class variables
	 *
	 * @access protected
	 */
	reset(): void {
		this.ongoingCalls = []
		this.connected = false
		this.hasIngoingCall = false
		this.hasOutgoingCall = false
		this.hasRingingCall = false
		this.autoAnswerConfig = {
			Delay: '',
			Mode: WebexOnOffBoolean.Unknown,
			Mute: WebexOnOffBoolean.Unknown
		}
	}

	// private processJSON(msg: WebexMessage): void {
	// 	let message = JSON.parse(msg.toString())
	// 	if (message.method == 'xFeedback/Event') {
	// 		if (message.params.Status != undefined) {
	// 			let status = message.params.Status
	// 			if (status.Audio != undefined) {
	// 				if (status.Audio.SelectedDevice != null) this.setVariable('selected_device', status.Audio.SelectedDevice)

	// 				if (
	// 					status.Audio.Input != undefined &&
	// 					status.Audio.Input.Connectors != undefined &&
	// 					status.Audio.Input.Connectors.Microphone != undefined
	// 				) {
	// 					let muteState = ''
	// 					for (let index = 0; index < status.Audio.Input.Connectors.Microphone.length; index++) {
	// 						const element = status.Audio.Input.Connectors.Microphone[index]
	// 						muteState += `(Mic ${element.id} Mute: ${element.Mute})`
	// 						this.connectorMute[element.id] = element.Mute
	// 					}
	// 					this.setVariable('audio_connector_mute', muteState)
	// 				}
	// 				if (status.Audio.Volume != null) this.setVariable('volume', status.Audio.Volume)
	// 				if (status.Audio.Microphones != undefined && status.Audio.Microphones.MusicMode != undefined)
	// 					this.setVariable('microphones_musicmode', status.Audio.Microphones.MusicMode)
	// 				if (status.Audio.Microphones != undefined && status.Audio.Microphones.Mute != undefined) {
	// 					this.setVariable('microphones_mute', status.Audio.Microphones.Mute)
	// 					this.microphoneMute = status.Audio.Microphones.Mute == 'On' ? true : false
	// 					this.checkFeedbacks(FeedbackId.MicrophoneMute)
	// 				}
	// 			} else if (status.Call != undefined) {
	// 				this.ongoingCalls.length = 0
	// 				let outgoing = 0
	// 				let incoming = 0
	// 				let incoming_ringing = 0

	// 				status.Call.forEach((call: WebexCall) => {
	// 					this.ongoingCalls.push(call)
	// 					if (call.Direction == 'Outgoing') {
	// 						outgoing++
	// 					}
	// 					if (call.Direction == 'Incoming') {
	// 						incoming++
	// 					}
	// 					if (call.Status == 'Ringing') {
	// 						incoming_ringing++
	// 					}
	// 					this.setVariable('outgoing_calls', outgoing.toString())
	// 					this.setVariable('ingoing_calls', incoming.toString())
	// 					this.setVariable('ingoing_ringing_calls', incoming_ringing.toString())

	// 					outgoing > 0 ? (this.hasOutgoingCall = true) : (this.hasOutgoingCall = false)
	// 					incoming > 0 ? (this.hasIngoingCall = true) : (this.hasIngoingCall = false)
	// 					incoming_ringing > 0 ? (this.hasRingingCall = true) : (this.hasRingingCall = false)

	// 					this.checkFeedbacks(FeedbackId.Ringing)
	// 					this.checkFeedbacks(FeedbackId.HasIngoingCall)
	// 					this.checkFeedbacks(FeedbackId.HasOutgoingCall)
	// 				})

	// 				// console.log(this.ongoingCalls)
	// 			} else if (status.Time != undefined) {
	// 				if (status.Time.SystemTime != null) {
	// 					// let dateTime = new Date(status.Time.SystemTime)
	// 					// let showMsg = `${dateTime.getHours}:${dateTime.getMinutes} ${dateTime.getDay}-${dateTime.getMonth}-${dateTime.getFullYear}`
	// 					this.setVariable('systemtime', status.Time.SystemTime)
	// 				}
	// 			} else if (status.Conference != undefined) {
	// 				if (status.Conference.DoNotDisturb != null) {
	// 					this.setVariable('DoNotDisturb', status.Conference.DoNotDisturb)
	// 				}
	// 				if (status.Conference.Presentation != null) {
	// 					this.setVariable('Presentation', status.Conference.Presentation)
	// 				}
	// 				if (status.Conference.SelectedCallProtocol != null) {
	// 					this.setVariable('SelectedCallProtocol', status.Conference.SelectedCallProtocol)
	// 				}
	// 			} else if (status.Video != undefined && status.Video.Input != undefined) {
	// 				if (status.Video.Input.MainVideoSource != null) {
	// 					this.setVariable('MainVideoSource', status.Video.Input.MainVideoSource)
	// 				}
	// 				// if (status.Video.Input.Source [n] ConnectorId != null) {
	// 				// 	this.setVariable('Source [n] ConnectorId', status.Video.Input.Source [n] ConnectorId)
	// 				// }
	// 			} else {
	// 				console.log('feedback:', status)
	// 			}
	// 		}
	// 		if (
	// 			message.params.Configuration != undefined &&
	// 			message.params.Configuration.Conference != undefined &&
	// 			message.params.Configuration.Conference.AutoAnswer != undefined
	// 		) {
	// 			let AutoAnswer = message.params.Configuration.Conference.AutoAnswer
	// 			if (AutoAnswer.Mode != null)
	// 				this.setVariable('autoanswer_mode', message.params.Configuration.Conference.AutoAnswer.Mode)
	// 			if (AutoAnswer.Mute != null)
	// 				this.setVariable('autoanswer_mute', message.params.Configuration.Conference.AutoAnswer.Mute)
	// 			if (AutoAnswer.Delay != null)
	// 				this.setVariable('autoanswer_delay', message.params.Configuration.Conference.AutoAnswer.Delay)
	// 		}
	// 	} else {
	// 		console.log('message:', message)
	// 	}
	// }
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
		this.initSSH()
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
		try {
			if (this.xapi !== undefined) {
				this.xapi.close()
			}
		} catch (e) {
			// Ignore
		}
		this.debug('destroy', this.id)

		if (this.timer !== undefined) {
			clearInterval(this.timer)
			this.timer = undefined
		}
	}

	/**
	 * Processes a feedback state.
	 */
	public feedback(feedback: CompanionFeedbackEvent): CompanionFeedbackResult {
		return ExecuteFeedback(this, feedback)
	}
}

export = ControllerInstance
