import InstanceSkel = require('../../../instance_skel')
import WebSocket = require('ws')
// import { FeedbackId } from './feedback'

interface connector {
	id: string
	Mute: string
}

export enum WebexBoolean {
	True = 'True',
	False = 'False'
}

export enum WebexOnOffBoolean {
	On = 'On',
	Off = 'Off',
	Unknown = ''
}

export interface WebexConfigAutoAnswer {
	Delay: string
	Mode: WebexOnOffBoolean
	Mute: WebexOnOffBoolean
}

export interface WebexMessage {
	id: string
	result: { CallId: string; Mode: string; Delay: string; Mute: string }
}
export interface WebexCall {
	id: string
	AnswerState: string // 'Unanswered' | 'Answered'
	CallType: string
	CallbackNumber: string
	DeviceType: string
	Direction: 'Incoming' | 'Outgoing'
	DisplayName: string
	Duration: string
	Encryption: unknown
	PlacedOnHold?: WebexBoolean
	Protocol: string
	ReceiveCallRate: string
	RemoteNumber: string
	Status: 'Dialling' | 'Connected' | 'Ringing'
	TransmitCallRate: string
	ghost?: WebexBoolean
	Ice: string
}

export abstract class WebexInstanceSkel<T> extends InstanceSkel<T> {
	public websocket?: WebSocket
	public CallId!: string
	public ongoingCalls: WebexCall[] = []
	public connectorMute: connector[] = []
	public hasIngoingCall = false
	public hasRingingCall = false
	public hasOutgoingCall = false
	public microphoneMute = false
	public autoAnswerConfig: WebexConfigAutoAnswer = {
		Delay: '',
		Mode: WebexOnOffBoolean.Unknown,
		Mute: WebexOnOffBoolean.Unknown
	}
}
