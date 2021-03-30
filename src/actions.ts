import { WebexInstanceSkel } from './webex'

import { CompanionActionEvent, CompanionActions, CompanionInputFieldDropdown } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export enum ActionId {
	Custom = 'custom',
	Dial = 'dial',
	Disconnect = 'disconnect',
	Accept = 'accept',
	AutoAnswerMode = 'autoanswer_mode',
	AutoAnswerMute = 'autoanswer_mute',
	AutoAnswerDelay = 'autoanswer_delay',
	Volume = 'volume',
	MicrophoneMute = 'microphones_mute',
	MicrophoneInput = 'microphone_input',
	MusicMode = 'microphones_music_mode',
	MicrophoneNoiseRemoval = 'microphones_noise_removal',
	Presentation = 'presentation',
	VideoMatrix = 'video_matrix',
	CameraPreset = 'camera_preset'
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
	actions[ActionId.Accept] = {
		label: 'Call: Accept all incoming calls',
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
			},
			WebexOnOffBooleanDropdown('NoiseRemoval', 'NoiseRemoval')
		]
	}
	actions[ActionId.Presentation] = {
		label: 'Presentation',
		options: [
			{
				label: 'Start/Stop',
				id: 'StartStop',
				type: 'dropdown',
				choices: [
					{ id: 'Start', label: 'Start' },
					{ id: 'Stop', label: 'Stop' }
				],
				default: 'Start'
			},
			{
				label: 'ConnectorId',
				id: 'ConnectorId',
				default: 1,
				type: 'number',
				min: 1,
				max: 8
			},
			{
				label: 'Instance',
				id: 'Instance',
				type: 'dropdown',
				choices: [
					{ id: 'New', label: 'New' },
					{ id: '1', label: '1' },
					{ id: '2', label: '2' },
					{ id: '3', label: '3' },
					{ id: '4', label: '4' },
					{ id: '5', label: '5' },
					{ id: '6', label: '6' }
				],
				default: 'new'
			},
			{
				label: 'Layout',
				id: 'Layout',
				type: 'dropdown',
				choices: [
					{ id: 'Equal', label: 'Equal' },
					{ id: 'Prominent', label: 'Prominent' }
				],
				default: 'Equal'
			},
			{
				label: 'Presentation Source',
				id: 'PresentationSource',
				default: '1',
				type: 'textinput'
			},
			{
				label: 'SendingMode',
				id: 'SendingMode',
				type: 'dropdown',
				choices: [
					{ id: 'LocalRemote', label: 'LocalRemote' },
					{ id: 'LocalOnly', label: 'LocalOnly' }
				],
				default: 'LocalRemote'
			}
		]
	}
	actions[ActionId.CameraPreset] = {
		label: 'Camera: Activate Camera preset',
		options: [
			{
				label: 'Preset number 1-35',
				type: 'number',
				default: 1,
				id: 'PresetId',
				min: 1,
				max: 35
			}
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
			case ActionId.Accept: {
				command.id = '3'
				command.method = 'xCommand/Call/Accept'
				command.params = {}
				break
			}
			case ActionId.AutoAnswerDelay: {
				const delay = parseInt(String(opt.Delay))
				command.id = '110'
				command.method = 'xSet'
				command.params = { Path: ['Configuration', 'Conference', 'AutoAnswer', 'Delay'], Value: delay }
				break
			}
			case ActionId.AutoAnswerMute: {
				command.id = '110'
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
				opt.Mute == 'On'
					? (command.method = 'xCommand/Audio/Microphones/Mute')
					: (command.method = 'xCommand/Audio/Microphones/Unmute')
				break
			}
			case ActionId.MicrophoneInput: {
				console.log('Input todo')
				break
			}
			case ActionId.MusicMode: {
				command.id = '123'
				opt.MusicMode == 'On'
					? (command.method = 'xCommand/Audio/Microphones/MusicMode/Start')
					: (command.method = 'xCommand/Audio/Microphones/MusicMode/Stop')
				break
			}
			case ActionId.MicrophoneNoiseRemoval: {
				command.id = '124'
				opt.NoiseRemoval == 'On'
					? (command.method = `xCommand/Audio/Microphone/${opt.Input}/EchoControl/NoiseReduction/On`)
					: (command.method = `xCommand/Audio/Microphone/${opt.Input}/EchoControl/NoiseReduction/Off`)
				break
			}
			case ActionId.Presentation: {
				const connectorId = parseInt(String(opt.ConnectorId))
				let instance = null
				let presentationSource = null
				if (String(opt.Instance) == 'New') {
					instance = String(opt.Instance)
				} else instance = parseInt(String(opt.Instance))

				if (String(opt.PresentationSource) == 'None') {
					presentationSource = String(opt.PresentationSource)
				} else presentationSource = parseInt(String(opt.PresentationSource))

				command.id = '125'
				command.method = `xCommand/Presentation/Start`
				command.params = {
					ConnectorId: connectorId,
					Instance: instance,
					Layout: opt.Layout,
					PresentationSource: presentationSource,
					SendingMode: opt.SendingMode
				}
				break
			}
			case ActionId.CameraPreset: {
				const preset = parseInt(String(opt.PresetId))
				command.id = '126'
				command.method = 'xCommand/Camera/Preset/Activate'
				command.params = { PresetId: preset }
				break
			}
		}

		// let converted: string = JSON.stringify(command).replace(/\\/g, '')
		let converted: string = JSON.stringify(command)
		console.log(converted)
		instance.websocket?.send(converted)
	} catch (e) {
		instance.debug('Action failed: ' + e)
	}
}
