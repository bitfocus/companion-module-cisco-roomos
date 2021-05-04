import {
	CompanionFeedbackEvent,
	CompanionFeedbackResult,
	CompanionFeedbacks,
	CompanionInputFieldColor
} from '../../../instance_skel_types'
import { DeviceConfig } from './config'
import { WebexInstanceSkel, WebexOnOffBoolean } from './webex'

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
