import {
	CompanionAdvancedFeedbackResult,
	CompanionFeedbackAdvancedEvent,
	CompanionFeedbackDefinitions,
	CompanionInputFieldColor,
	CompanionVariableValues,
	combineRgb,
} from '@companion-module/base'
import { DeviceConfig } from './config.js'
import { WebexCall, RoomOSInstanceBase, RoomOSOnOffBoolean, RoomOSBoolean } from './roomos.js'

export enum FeedbackId {
	Ringing = 'ringing',
	HasIngoingCall = 'hasingoingcall',
	HasOutgoingCall = 'hasoutgoingcall',
	AutoAnswer = 'autoanswer',
	MicrophoneMute = 'microphonemute',
}

export function ForegroundPicker(color: number): CompanionInputFieldColor {
	return {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: color,
	}
}
export function BackgroundPicker(color: number): CompanionInputFieldColor {
	return {
		type: 'colorpicker',
		label: 'Background color',
		id: 'bg',
		default: color,
	}
}
export function HandleXAPICall(instance: RoomOSInstanceBase<DeviceConfig>, call: WebexCall): void {
	if (call.ghost === RoomOSBoolean.True) {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function HandleXAPIConfFeedback(instance: RoomOSInstanceBase<DeviceConfig>, event: any): void {
	console.log('RoomOS CONFIG: ', instance.id, event)

	if (event.Conference?.AutoAnswer) {
		const newValues: CompanionVariableValues = {}

		if (event.Conference?.AutoAnswer?.Mode) {
			if (instance.autoAnswerConfig.Mode !== event.Conference?.AutoAnswer?.Mode) {
				instance.autoAnswerConfig.Mode = event.Conference?.AutoAnswer?.Mode
				instance.checkFeedbacks(FeedbackId.AutoAnswer)
			}
			newValues['autoanswer_mode'] = instance.autoAnswerConfig.Mode
		}
		instance.autoAnswerConfig = {
			...instance.autoAnswerConfig,
			...event.Conference?.AutoAnswer,
		}
		newValues['autoanswer_delay'] = instance.autoAnswerConfig.Delay

		instance.setVariableValues(newValues)
	}
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function HandleXAPIFeedback(instance: RoomOSInstanceBase<DeviceConfig>, event: any): void {
	// console.log('RoomOS EVENT: ', instance.id, event)

	const newValues: CompanionVariableValues = {}
	const checkFeedbacks: FeedbackId[] = []

	if (event.Audio) {
		if (event.Audio.SelectedDevice != null) newValues['selected_device'] = event.Audio.SelectedDevice

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
			newValues['audio_connector_mute'] = muteState
		}
		if (event.Audio.Volume != null) newValues['volume'] = event.Audio.Volume
		if (event.Audio.Microphones != undefined && event.Audio.Microphones.MusicMode != undefined)
			newValues['microphones_musicmode'] = event.Audio.Microphones.MusicMode
		if (event.Audio.Microphones != undefined && event.Audio.Microphones.Mute != undefined) {
			newValues['microphones_mute'] = event.Audio.Microphones.Mute
			instance.microphoneMute = event.Audio.Microphones.Mute == 'On' ? true : false
			checkFeedbacks.push(FeedbackId.MicrophoneMute)
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
			checkFeedbacks.push(FeedbackId.Ringing)
		}

		if (currentlyHasIngoingCalls !== instance.hasIngoingCall) {
			instance.hasIngoingCall = currentlyHasIngoingCalls
			checkFeedbacks.push(FeedbackId.HasIngoingCall)
		}

		if (currentlyHasOutgoingCalls !== instance.hasOutgoingCall) {
			instance.hasOutgoingCall = currentlyHasOutgoingCalls
			checkFeedbacks.push(FeedbackId.HasOutgoingCall)
		}

		newValues['outgoing_calls'] = String(currentlyOutgoingCalls.length)
		newValues['ingoing_calls'] = String(currentlyIngoingCalls.length)
		newValues['ingoing_ringing_calls'] = String(currentlyRingingCalls.length)
	} else if (event.SystemUnit) {
		console.log('SYSTEMUNIT: ', event.SystemUnit)
	} else if (event.Conference) {
		console.log('CONFERENCE: ', event.Conference)
	} else if (event.Time) {
		console.log('TIME: ', event.Time)
		newValues['systemtime'] = event.Time.SystemTime
	}

	instance.setVariableValues(newValues)
	if (checkFeedbacks.length) instance.checkFeedbacks(...checkFeedbacks)
}

export function GetFeedbacksList(instance: RoomOSInstanceBase<DeviceConfig>): CompanionFeedbackDefinitions {
	const feedbacks: CompanionFeedbackDefinitions = {}

	const getOptColors = (feedback: CompanionFeedbackAdvancedEvent): CompanionAdvancedFeedbackResult => ({
		color: Number(feedback.options.fg),
		bgcolor: Number(feedback.options.bg),
	})

	feedbacks[FeedbackId.Ringing] = {
		type: 'advanced',
		name: 'Change colors if device is ringing',
		description: 'If the device is has a ingoing call, change colors of the bank',
		options: [ForegroundPicker(combineRgb(0, 0, 0)), BackgroundPicker(combineRgb(255, 255, 0))],
		callback: (feedback): CompanionAdvancedFeedbackResult => {
			if (instance.hasRingingCall) {
				return getOptColors(feedback)
			}
			return {}
		},
	}

	feedbacks[FeedbackId.HasIngoingCall] = {
		type: 'advanced',
		name: 'Change colors if device has ingoing calls',
		description: 'If the device is has any calls in ingoing direction, change colors of the bank',
		options: [ForegroundPicker(combineRgb(0, 0, 0)), BackgroundPicker(combineRgb(0, 255, 0))],
		callback: (feedback): CompanionAdvancedFeedbackResult => {
			if (instance.hasIngoingCall) {
				return getOptColors(feedback)
			}
			return {}
		},
	}

	feedbacks[FeedbackId.HasOutgoingCall] = {
		type: 'advanced',
		name: 'Change colors if device has outgoing calls',
		description: 'If the device is has any calls in outgoing direction, change colors of the bank',
		options: [ForegroundPicker(combineRgb(0, 0, 0)), BackgroundPicker(combineRgb(0, 255, 0))],
		callback: (feedback): CompanionAdvancedFeedbackResult => {
			if (instance.hasOutgoingCall) {
				return getOptColors(feedback)
			}
			return {}
		},
	}

	feedbacks[FeedbackId.AutoAnswer] = {
		type: 'advanced',
		name: 'Change colors if device is set to auto-answer calls',
		description: 'If the device is set to auto-answer, change colors of the bank',
		options: [ForegroundPicker(combineRgb(0, 0, 0)), BackgroundPicker(combineRgb(255, 255, 255))],
		callback: (feedback): CompanionAdvancedFeedbackResult => {
			if (instance.autoAnswerConfig.Mode === RoomOSOnOffBoolean.On) {
				return getOptColors(feedback)
			}
			return {}
		},
	}

	feedbacks[FeedbackId.MicrophoneMute] = {
		type: 'advanced',
		name: 'Change colors if microphone is set mute',
		description: 'If the microphone is set mute, change colors of the bank',
		options: [ForegroundPicker(combineRgb(0, 0, 0)), BackgroundPicker(combineRgb(255, 0, 0))],
		callback: (feedback): CompanionAdvancedFeedbackResult => {
			if (instance.microphoneMute) {
				return getOptColors(feedback)
			}
			return {}
		},
	}

	return feedbacks
}
