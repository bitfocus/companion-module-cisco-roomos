import {
	CompanionFeedbackEvent,
	CompanionFeedbackResult,
	CompanionFeedbacks,
	CompanionInputFieldColor
} from '../../../instance_skel_types'
import { DeviceConfig } from './config'
import { WebexCall, WebexInstanceSkel, WebexOnOffBoolean, WebexBoolean } from './webex'

export enum FeedbackId {
	Ringing = 'ringing',
	HasIngoingCall = 'hasingoingcall',
	HasOutgoingCall = 'hasoutgoingcall',
	AutoAnswer = 'autoanswer',
	MicrophoneMute = 'microphonemute'
}

export function ForegroundPicker(color: number): CompanionInputFieldColor {
	return {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: color
	}
}
export function BackgroundPicker(color: number): CompanionInputFieldColor {
	return {
		type: 'colorpicker',
		label: 'Background color',
		id: 'bg',
		default: color
	}
}
export function HandleXAPICall(instance: WebexInstanceSkel<DeviceConfig>, call: WebexCall): void {
	if (call.ghost === WebexBoolean.True) {
		instance.ongoingCalls = instance.ongoingCalls.filter((existingCall) => existingCall.id !== call.id)
	} else {
		const existingCall = instance.ongoingCalls.find((existingCall) => existingCall.id === call.id)

		if (existingCall !== undefined) {
			instance.ongoingCalls = instance.ongoingCalls.map((existingCall) =>
				existingCall.id === call.id ? { ...existingCall, ...call } : { ...existingCall }
			)
		} else {
			instance.ongoingCalls = [...instance.ongoingCalls, call]
		}
	}
	console.log('DEBUG: CALLS: ', instance.ongoingCalls)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HandleXAPIConfFeedback(instance: WebexInstanceSkel<DeviceConfig>, event: any): void {
	console.log('WEBEX CONFIG: ', instance.id, event)

	if (event.Conference?.AutoAnswer) {
		if (event.Conference?.AutoAnswer?.Mode) {
			if (instance.autoAnswerConfig.Mode !== event.Conference?.AutoAnswer?.Mode) {
				instance.autoAnswerConfig.Mode = event.Conference?.AutoAnswer?.Mode
				instance.checkFeedbacks(FeedbackId.AutoAnswer)
			}
			instance.setVariable('autoanswer_mode', instance.autoAnswerConfig.Mode)
		}
		instance.autoAnswerConfig = {
			...instance.autoAnswerConfig,
			...event.Conference?.AutoAnswer
		}
		instance.setVariable('autoanswer_delay', instance.autoAnswerConfig.Delay)
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HandleXAPIFeedback(instance: WebexInstanceSkel<DeviceConfig>, event: any): void {
	// console.log('WEBEX EVENT: ', instance.id, event)

	if (event.Audio) {
		if (event.Audio.SelectedDevice != null) instance.setVariable('selected_device', event.Audio.SelectedDevice)

		if (
			event.Audio.Input != undefined &&
			event.Audio.Input.Connectors != undefined &&
			event.Audio.Input.Connectors.Microphone != undefined
		) {
			let muteState = ''
			for (let index = 0; index < event.Audio.Input.Connectors.Microphone.length; index++) {
				const element = event.Audio.Input.Connectors.Microphone[index]
				muteState += `(Mic ${element.id} Mute: ${element.Mute})`
				instance.connectorMute[element.id] = element.Mute
			}
			instance.setVariable('audio_connector_mute', muteState)
		}
		if (event.Audio.Volume != null) instance.setVariable('volume', event.Audio.Volume)
		if (event.Audio.Microphones != undefined && event.Audio.Microphones.MusicMode != undefined)
			instance.setVariable('microphones_musicmode', event.Audio.Microphones.MusicMode)
		if (event.Audio.Microphones != undefined && event.Audio.Microphones.Mute != undefined) {
			instance.setVariable('microphones_mute', event.Audio.Microphones.Mute)
			instance.microphoneMute = event.Audio.Microphones.Mute == 'On' ? true : false
			instance.checkFeedbacks(FeedbackId.MicrophoneMute)
		}
	}

	if (event.Call) {
		event.Call.forEach((call: WebexCall) => HandleXAPICall(instance, call))
		const currentlyRingingCalls = instance.ongoingCalls.filter(
			(call) => call.Direction === 'Incoming' && call.Status === 'Ringing'
		)
		const currentlyIngoingCalls = instance.ongoingCalls.filter((call) => call.Direction === 'Incoming')
		const currentlyOutgoingCalls = instance.ongoingCalls.filter((call) => call.Direction === 'Outgoing')

		const currentlyHasRingingCalls = currentlyRingingCalls.length > 0
		const currentlyHasIngoingCalls = currentlyIngoingCalls.length > 0
		const currentlyHasOutgoingCalls = currentlyOutgoingCalls.length > 0

		if (currentlyHasRingingCalls !== instance.hasRingingCall) {
			instance.hasRingingCall = currentlyHasRingingCalls
			instance.checkFeedbacks(FeedbackId.Ringing)
		}

		if (currentlyHasIngoingCalls !== instance.hasIngoingCall) {
			instance.hasIngoingCall = currentlyHasIngoingCalls
			instance.checkFeedbacks(FeedbackId.HasIngoingCall)
		}

		if (currentlyHasOutgoingCalls !== instance.hasOutgoingCall) {
			instance.hasOutgoingCall = currentlyHasOutgoingCalls
			instance.checkFeedbacks(FeedbackId.HasOutgoingCall)
		}

		instance.setVariable('outgoing_calls', String(currentlyOutgoingCalls.length))
		instance.setVariable('ingoing_calls', String(currentlyIngoingCalls.length))
		instance.setVariable('ingoing_ringing_calls', String(currentlyRingingCalls.length))
	} else if (event.SystemUnit) {
		console.log('SYSTEMUNIT: ', event.SystemUnit)
	} else if (event.Conference) {
		console.log('CONFERENCE: ', event.Conference)
	} else if (event.Time) {
		console.log('TIME: ', event.Time)
		instance.setVariable('systemtime', event.Time.SystemTime)
	}
}

export function GetFeedbacksList(instance: WebexInstanceSkel<DeviceConfig>): CompanionFeedbacks {
	const feedbacks: CompanionFeedbacks = {}

	feedbacks[FeedbackId.Ringing] = {
		label: 'Change colors if device is ringing',
		description: 'If the device is has a ingoing call, change colors of the bank',
		options: [ForegroundPicker(instance.rgb(0, 0, 0)), BackgroundPicker(instance.rgb(255, 255, 0))]
	}

	feedbacks[FeedbackId.HasIngoingCall] = {
		label: 'Change colors if device has ingoing calls',
		description: 'If the device is has any calls in ingoing direction, change colors of the bank',
		options: [ForegroundPicker(instance.rgb(0, 0, 0)), BackgroundPicker(instance.rgb(0, 255, 0))]
	}

	feedbacks[FeedbackId.HasOutgoingCall] = {
		label: 'Change colors if device has outgoing calls',
		description: 'If the device is has any calls in outgoing direction, change colors of the bank',
		options: [ForegroundPicker(instance.rgb(0, 0, 0)), BackgroundPicker(instance.rgb(0, 255, 0))]
	}

	feedbacks[FeedbackId.AutoAnswer] = {
		label: 'Change colors if device is set to auto-answer calls',
		description: 'If the device is set to auto-answer, change colors of the bank',
		options: [ForegroundPicker(instance.rgb(0, 0, 0)), BackgroundPicker(instance.rgb(255, 255, 255))]
	}

	feedbacks[FeedbackId.MicrophoneMute] = {
		label: 'Change colors if microphone is set mute',
		description: 'If the microphone is set mute, change colors of the bank',
		options: [ForegroundPicker(instance.rgb(0, 0, 0)), BackgroundPicker(instance.rgb(255, 0, 0))]
	}

	return feedbacks
}

export function ExecuteFeedback(
	instance: WebexInstanceSkel<DeviceConfig>,
	feedback: CompanionFeedbackEvent
): CompanionFeedbackResult {
	const opt = feedback.options
	const getOptColors = (): CompanionFeedbackResult => ({ color: Number(opt.fg), bgcolor: Number(opt.bg) })

	const feedbackType = feedback.type as FeedbackId

	switch (feedbackType) {
		case FeedbackId.Ringing:
			if (instance.hasRingingCall) {
				return getOptColors()
			}
			break

		case FeedbackId.HasOutgoingCall:
			if (instance.hasOutgoingCall) {
				return getOptColors()
			}
			break

		case FeedbackId.HasIngoingCall:
			if (instance.hasIngoingCall) {
				return getOptColors()
			}
			break

		case FeedbackId.AutoAnswer:
			if (instance.autoAnswerConfig.Mode === WebexOnOffBoolean.On) {
				return getOptColors()
			}
			break

		case FeedbackId.MicrophoneMute:
			if (instance.microphoneMute) {
				return getOptColors()
			}
			break

		default:
			instance.log('warn', `Webex: Unhandled feedback: ${feedbackType}`)
	}

	return {}
}
