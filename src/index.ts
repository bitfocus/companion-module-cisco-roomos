import { WebexInstanceSkel, WebexOnOffBoolean, WebexConfigAutoAnswer } from './webex.js'
import { connect as XAPIConnect } from 'jsxapi'
import { GetActionsList } from './actions.js'
import { DeviceConfig, GetConfigFields } from './config.js'
import { FeedbackId, GetFeedbacksList, HandleXAPIConfFeedback, HandleXAPIFeedback } from './feedback.js'
import { GetPresetsList } from './presets.js'
import { InitVariables } from './variables.js'
import {
	CompanionVariableValues,
	InstanceStatus,
	SomeCompanionConfigField,
	runEntrypoint,
} from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'

class ControllerInstance extends WebexInstanceSkel<DeviceConfig> {
	private connected: boolean
	private connecting: boolean
	private timer?: NodeJS.Timer

	private config!: DeviceConfig

	constructor(internal: unknown) {
		super(internal)

		this.connected = false
		this.connecting = false
	}

	public async init(config: DeviceConfig): Promise<void> {
		await this.configUpdated(config)
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
			if (this.config.host) {
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
				password,
			})

			this.connecting = true
			this.updateStatus(InstanceStatus.Connecting)

			this.xapi.on('error', (error) => {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Cisco Webex error: ' + error)
				this.xapi = undefined
				this.connected = false
				this.connecting = false
				this.reset()
			})

			this.xapi.on('ready', () => {
				// console.log('ready THIS:', this)
				this.updateStatus(InstanceStatus.Ok)
				this.connected = true
				this.checkFeedbacks()

				this.xapi?.config
					.get('Conference AutoAnswer')
					.then((value) => {
						if (value?.Mode) {
							const newValues: CompanionVariableValues = {}
							if (value?.Mode != null) newValues['autoanswer_mode'] = value.Mode
							if (value?.Mute != null) newValues['autoanswer_mute'] = value.Mute
							if (value?.Delay != null) newValues['autoanswer_delay'] = value.Delay
							this.setVariableValues(newValues)
							this.autoAnswerConfig = value as WebexConfigAutoAnswer
						}
					})
					.catch((e) => {
						this.log('error', `Failed to check Conference AutoAnswer: ${e}`)
					})
				this.xapi?.Status.Conference.get()
					.then((value: any) => {
						const newValues: CompanionVariableValues = {}

						if (value.DoNotDisturb != null) {
							newValues['DoNotDisturb'] = value.DoNotDisturb
						}
						if (value.Presentation != null) {
							newValues['Presentation'] = value.Presentation.CallId + value.Presentation.Mode
						}
						if (value.SelectedCallProtocol != null) {
							newValues['SelectedCallProtocol'] = value.SelectedCallProtocol
						}

						this.setVariableValues(newValues)
					})
					.catch((e: any) => {
						this.log('error', `Failed to check Conference: ${e}`)
					})

				this.xapi?.Status.Time.SystemTime.get()
					.then((time: Date) => {
						this.setVariableValues({ systemtime: time.toString() })
					})
					.catch((e: any) => {
						this.log('error', `Failed to check Time SystemTime: ${e}`)
					})
				this.xapi?.Status.Audio.SelectedDevice.get()
					.then((value: any) => {
						console.log('AUDIO SELECTED DEVICE:', value)
						this.setVariableValues({ selected_device: value.SelectedDevice })
					})
					.catch((e: any) => {
						this.log('error', `Failed to check Audio SelectedDevice: ${e}`)
					})
				this.xapi?.Status.Audio.get()
					.then((value: any) => {
						let muteState = ''
						for (let index = 0; index < value.Input.Connectors.Microphone.length; index++) {
							const element = value.Input.Connectors.Microphone[index]
							muteState += `(Mic ${element.id} Mute: ${element.Mute})`
							this.connectorMute[element.id] = element.Mute
						}
						this.setVariableValues({
							audio_connector_mute: muteState,
							volume: value.Volume,
							microphones_musicmode: value.Microphones.MusicMode,
							microphones_mute: value.Microphones.Mute,
						})
						this.microphoneMute = value.Microphones.Mute == 'On' ? true : false
						this.checkFeedbacks(FeedbackId.MicrophoneMute)
					})
					.catch((e: any) => {
						this.log('error', `Failed to check Audio: ${e}`)
					})
			})

			this.xapi.feedback.on('Status', (event) => HandleXAPIFeedback(this, event))
			this.xapi.feedback.on('Configuration', (event) => HandleXAPIConfFeedback(this, event))
		} catch (e: any) {
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
			Mute: WebexOnOffBoolean.Unknown,
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
	public async configUpdated(config: DeviceConfig): Promise<void> {
		this.config = config
		this.setActionDefinitions(GetActionsList(this))
		InitVariables(this)
		this.initSSH()
		this.setFeedbackDefinitions(GetFeedbacksList(this))
		this.setPresetDefinitions(GetPresetsList())
	}

	/**
	 * Creates the configuration fields for web config.
	 */
	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	/**
	 * Clean up the instance before it is destroyed.
	 */
	public async destroy(): Promise<void> {
		try {
			if (this.xapi !== undefined) {
				this.xapi.close()
			}
		} catch (e) {
			// Ignore
		}

		if (this.timer !== undefined) {
			clearInterval(this.timer)
			this.timer = undefined
		}
	}
}

runEntrypoint(ControllerInstance, UpgradeScripts)
