import { WebexInstanceSkel } from './webex'

import { CompanionActionEvent, CompanionActions, CompanionInputFieldDropdown } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export enum ActionId {
	Custom = 'custom',
	Dial = 'dial',
	Disconnect = 'disconnect',
	AutoAnswerMode = 'autoanswer_mode',
	AutoAnswerMute = 'autoanswer_mute',
	AutoAnswerDelay = 'autoanswer_delay',
	Volume = 'volume',
	MicrophoneMute = 'microphones_mute',
	MicrophoneInput = 'microphone_input',
	MusicMode = 'microphones_music_mode',
	MicrophoneNoiseRemoval = 'microphones_noise_removal'
}

function WebexOnOffBooleanDropdown(id: string, label: string): CompanionInputFieldDropdown {
	return {
		id,
		label,
		type: 'dropdown',
		default: 'Off',
		choices: [
			{
				label: 'On',
				id: 'On'
			},
			{
				label: 'Off',
				id: 'Off'
			}
		]
	}
}

export function GetActionsList(self: WebexInstanceSkel<DeviceConfig>): CompanionActions {
	const actions: CompanionActions = {}

	actions[ActionId.Custom] = {
		label: 'Custom',
		options: [
			{
				type: 'textinput',
				label: 'method',
				id: 'method',
				default: 'xGet',
				regex: self.REGEX_SOMETHING
			},
			{
				type: 'textinput',
				label: 'path (split items with ,)',
				id: 'path',
				default: 'Configuration,Conference,AutoAnswer',
				regex: self.REGEX_SOMETHING
			}
		]
	}
	actions[ActionId.Dial] = {
		label: 'Call: Dial',
		options: [
			{
				type: 'textinput',
				label: 'Address to call',
				id: 'number',
				default: '',
				regex: self.REGEX_SOMETHING
			}
		]
	}
	actions[ActionId.Disconnect] = {
		label: 'Call: Disconnect',
		options: []
	}
	actions[ActionId.AutoAnswerMode] = {
		label: 'Call: Configure auto-answer mode',
		options: [WebexOnOffBooleanDropdown('Mode', 'Mode')]
	}
	actions[ActionId.AutoAnswerMute] = {
		label: 'Call: Configure auto-answer mute',
		options: [WebexOnOffBooleanDropdown('Mute', 'Mute')]
	}
	actions[ActionId.AutoAnswerDelay] = {
		label: 'Call: Configure auto-answer delay',
		options: [
			{
				type: 'textinput',
				default: '0',
				label: 'Delay (in seconds)',
				id: 'Delay',
				regex: self.REGEX_NUMBER
			}
		]
	}
	actions[ActionId.Volume] = {
		label: 'Audio: Volume',
		options: [
			{
				type: 'number',
				default: 80,
				label: 'level 0-100',
				min: 0,
				max: 100,
				id: 'volume'
			}
		]
	}
	actions[ActionId.MicrophoneMute] = {
		label: 'Audio: Microphones Mute',
		options: [WebexOnOffBooleanDropdown('Mute', 'Mute')]
	}
	actions[ActionId.MicrophoneInput] = {
		label: 'Audio: Microphone input',
		options: []
	}
	actions[ActionId.MusicMode] = {
		label: 'Audio: Microphones Music Mode',
		options: [WebexOnOffBooleanDropdown('MusicMode', 'MusicMode')]
	}
	actions[ActionId.MicrophoneNoiseRemoval] = {
		label: 'Audio: Microphones Noise removal',
		options: [
			{ 
				label: 'Input',
				id: 'Input',
				type: 'number',
				min: 1,
				max: 8,
				default: 1
			},WebexOnOffBooleanDropdown('NoiseRemoval', 'NoiseRemoval')
			]
	}

	return actions
}

export async function HandleAction(
	instance: WebexInstanceSkel<DeviceConfig>,
	action: CompanionActionEvent
): Promise<void> {
	const opt = action.options

	try {
		const actionId = action.action as ActionId
		let command = {
			jsonrpc: '2.0',
			id: '0',
			method: '',
			params: {}
		}

		switch (actionId) {
			case ActionId.Custom: {
				command.id = '0'
				command.method = opt.method!.toString()
				command.params = { Path: opt.path?.toString().split(',') }
				break
			}
			case ActionId.Dial: {
				command.id = '1'
				command.method = 'xCommand/Dial'
				command.params = { Number: opt.number }
				break
			}
			case ActionId.Disconnect: {
				command.id = '2'
				command.method = 'xCommand/Call/Disconnect'
				command.params = { CallId: instance.CallId }
				break
			}
			case ActionId.AutoAnswerDelay: {
				const delay = parseInt(String(opt.Delay))
				command.id = '110'
				command.method ='xSet'
				command.params = { Path: ['Configuration', 'Conference', 'AutoAnswer', 'Delay'], Value: delay }
				break
			}
			case ActionId.AutoAnswerMute: {
				command.id ='110'
				command.method = 'xSet'
				command.params = { Path: ['Configuration', 'Conference', 'AutoAnswer', 'Mute'], Value: opt.Mute }
				break
			}
			case ActionId.AutoAnswerMode: {
				command.id = '110'
				command.method = 'xSet'
				command.params = { Path: ['Configuration', 'Conference', 'AutoAnswer', 'Mode'], Value: opt.Mode }
				break
			}
			case ActionId.Volume: {
				const volume = parseInt(String(opt.volume))
				command.id = '120'
				command.method = 'xCommand/Audio/Volume/Set' 
				command.params = { Level: volume } 
				break
			}
			case ActionId.MicrophoneMute: {
				command.id = '121'
				opt.Mute == 'On' ? command.method = 'xCommand/Audio/Microphones/Mute' : command.method = 'xCommand/Audio/Microphones/Unmute'
				break
			}
			case ActionId.MicrophoneInput: {
				console.log('Input')
				break
			}
			case ActionId.MusicMode: {
				command.id = '123'
				opt.MusicMode == 'On' ? command.method = 'xCommand/Audio/Microphones/MusicMode/Start' : command.method = 'xCommand/Audio/Microphones/MusicMode/Stop'
				break
			}
			case ActionId.MicrophoneNoiseRemoval: {
				command.id = '124'
				opt.NoiseRemoval == 'On' ? command.method = `xCommand/Audio/Microphone/${opt.Input}/EchoControl/NoiseReduction/On` : command.method = `xCommand/Audio/Microphone/${opt.Input}/EchoControl/NoiseReduction/Off`
				break
			}
			default: {
				// let converted: string = JSON.stringify(command).replace(/\\/g, '')
				let converted: string = JSON.stringify(command)
				console.log(converted)
				instance.websocket?.send(converted)
			}
		}
	} catch (e) {
		instance.debug('Action failed: ' + e)
	}
}
