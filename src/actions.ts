import { WebexInstanceSkel } from './webex'

import { CompanionActionEvent, CompanionActions, CompanionInputFieldDropdown } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export enum ActionId {
	CustomConfiguration = 'custom_configuration',
	CustomCommand = 'custom_configuration',
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
	CameraPreset = 'camera_preset',
	SetMainVideoSource = 'set_main_video_source',
	CameraPositionSet = 'camera_position_set',
	VideoMatrixReset = 'video_matrix_reset',
	TriggerAutofocus = 'trigger_auto_focus',
	CameraRamp = 'camera_ramp',
	DTMFSend = 'DTMF_send',
	ConferenceDoNotDisturbActivate = 'conference_do_not_disturb_activate',
	ConferenceDoNotDisturbDeActivate = 'conference_do_not_disturb_deactivate',
	SelfView = 'self_view',
	OSDKeyClick = 'OSD_key_click',
	OSDKeyPress = 'OSD_key_press',
	OSDKeyRelease = 'OSD_key_release',
	CameraBackground = 'camera_background',
	VideoMonitors = 'video_monitors',
	VideoOutputMonitorRole = 'video_output_monitor_role',
	MessageSend = 'message_send',
	StandbyControl = 'standby_control',
	StandbyDelay = 'standby_control'
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
function RemoteKeyToPressDropdown(): CompanionInputFieldDropdown {
	return {
		id: 'Key',
		label: 'Key',
		type: 'dropdown',
		default: 'Home',
		choices: [
			{ label: '0', id: '0' },
			{ label: '1', id: '1' },
			{ label: '2', id: '2' },
			{ label: '3', id: '3' },
			{ label: '4', id: '4' },
			{ label: '5', id: '5' },
			{ label: '6', id: '6' },
			{ label: '7', id: '7' },
			{ label: '8', id: '8' },
			{ label: '9', id: '9' },
			{ label: 'C', id: 'C' },
			{ label: 'Call', id: 'Call' },
			{ label: 'Disconnect', id: 'Disconnect' },
			{ label: 'Down', id: 'Down' },
			{ label: 'F1', id: 'F1' },
			{ label: 'F2', id: 'F2' },
			{ label: 'F3', id: 'F3' },
			{ label: 'F4', id: 'F4' },
			{ label: 'F5', id: 'F5' },
			{ label: 'Grab', id: 'Grab' },
			{ label: 'Home', id: 'Home' },
			{ label: 'Layout', id: 'Layout' },
			{ label: 'Left', id: 'Left' },
			{ label: 'Mute', id: 'Mute' },
			{ label: 'MuteMic', id: 'MuteMic' },
			{ label: 'Ok', id: 'Ok' },
			{ label: 'PhoneBook', id: 'PhoneBook' },
			{ label: 'Presentation', id: 'Presentation' },
			{ label: 'Right', id: 'Right' },
			{ label: 'Selfview', id: 'Selfview' },
			{ label: 'Square', id: 'Square' },
			{ label: 'SrcAux', id: 'SrcAux' },
			{ label: 'SrcCamera', id: 'SrcCamera' },
			{ label: 'SrcDocCam', id: 'SrcDocCam' },
			{ label: 'SrcPc', id: 'SrcPc' },
			{ label: 'SrcVcr', id: 'SrcVcr' },
			{ label: 'Star', id: 'Star' },
			{ label: 'Up', id: 'Up' },
			{ label: 'VolumeUp', id: 'VolumeUp' },
			{ label: 'VolumeDown', id: 'VolumeDown' },
			{ label: 'ZoomIn', id: 'ZoomIn' },
			{ label: 'ZoomOut', id: 'ZoomOut' },
			{ label: '+', id: '+' },
			{ label: '-', id: '-' }
		]
	}
}

export function GetActionsList(self: WebexInstanceSkel<DeviceConfig>): CompanionActions {
	const actions: CompanionActions = {}

	actions[ActionId.CustomConfiguration] = {
		label: 'Custom xConfiguration',
		options: [
			{
				type: 'textinput',
				label: 'Path (split items with ,)',
				id: 'path',
				default: 'Configuration,Conference,AutoAnswer',
				regex: self.REGEX_SOMETHING
			},
			{
				type: 'textinput',
				label: 'Value',
				id: 'Value',
				default: '',
				regex: self.REGEX_SOMETHING
			}
		]
	}
	actions[ActionId.CustomCommand] = {
		label: 'Custom xCommand',
		options: [
			{
				type: 'textinput',
				label: 'Method',
				id: 'Method',
				default: 'xCommand/...',
				regex: self.REGEX_SOMETHING
			},
			{
				type: 'textinput',
				label: 'Params (Put in JSON)',
				id: 'Params',
				default: '{Key:Value}',
				regex: self.REGEX_SOMETHING
			},

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
		options: [
			{
				label: 'Call ID 0 = All',
				id: 'CallId',
				type: 'number',
				min: 0,
				max: 255,
				default: 0
			}
		]
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
	actions[ActionId.VideoMatrix] = {
		label: 'Video Matrix',
		options: [
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
				label: 'Mode',
				id: 'Mode',
				type: 'dropdown',
				choices: [
					{ id: 'Add', label: 'Add' },
					{ id: 'Replace', label: 'Replace' }
				],
				default: 'Add'
			},
			{
				label: 'Output',
				id: 'Output',
				default: 1,
				type: 'number',
				min: 1,
				max: 3
			},
			{
				label: 'RemoteMain',
				id: 'RemoteMain',
				default: 1,
				type: 'number',
				min: 1,
				max: 4
			},
			{
				label: 'SourceId',
				id: 'SourceId',
				default: 1,
				type: 'number',
				min: 1,
				max: 255
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
	actions[ActionId.SetMainVideoSource] = {
		label: 'Set Main Video Source',
		options: [
			{
				label: 'ConnectorId',
				id: 'ConnectorId',
				default: 1,
				type: 'number',
				min: 1,
				max: 255
			},
			{
				label: 'Layout',
				id: 'Layout',
				type: 'dropdown',
				choices: [
					{ id: 'Equal', label: 'Equal' },
					{ id: 'PIP', label: 'PIP' },
					{ id: 'Prominent', label: 'Prominent' }
				],
				default: 'Equal'
			},
			{
				label: 'PIP Position',
				id: 'PIPPosition',
				type: 'dropdown',
				choices: [
					{ id: 'LowerLeft', label: 'LowerLeft' },
					{ id: 'LowerRight', label: 'LowerRight' },
					{ id: 'UpperLeft', label: 'UpperLeft' },
					{ id: 'UpperRight', label: 'UpperRight' }
				],
				default: 'LowerLeft'
			},
			{
				label: 'PIP Size',
				id: 'PIPSize',
				type: 'dropdown',
				choices: [
					{ id: 'Auto', label: 'Auto' },
					{ id: 'Large', label: 'Large' }
				],
				default: 'Auto'
			},
			{
				label: 'SourceId',
				id: 'SourceId',
				default: 1,
				type: 'number',
				min: 1,
				max: 255
			}
		]
	}
	actions[ActionId.CameraPositionSet] = {
		label: 'Set camera position',
		options: [
			{
				label: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1,
				id: 'CameraId'
			},
			{
				label: 'Focus',
				type: 'number',
				min: 0,
				max: 65535,
				default: 30000,
				id: 'Focus'
			},
			{
				label: 'Lens',
				type: 'dropdown',
				choices: [
					{ label: 'Wide', id: 'Wide' },
					{ label: 'Center', id: 'Center' },
					{ label: 'Left', id: 'Left' },
					{ label: 'Center', id: 'Center' }
				],
				default: 'Center',
				id: 'Lens'
			},
			{
				label: 'Pan',
				type: 'number',
				min: -17000,
				max: 17000,
				default: 0,
				id: 'Pan'
			},
			{
				label: 'Roll',
				type: 'number',
				min: -300,
				max: 300,
				default: 0,
				id: 'Pan'
			},
			{
				label: 'Tilt',
				type: 'number',
				min: -9000,
				max: 9000,
				default: 0,
				id: 'Pan'
			},
			{
				label: 'Zoom',
				type: 'number',
				min: 0,
				max: 11800,
				default: 5000,
				id: 'Zoom'
			}
		]
	}
	actions[ActionId.VideoMatrixReset] = {
		label: 'Video Matrix Reset',
		options: [
			{
				label: 'Output',
				type: 'number',
				min: 1,
				max: 3,
				default: 1,
				id: 'Output'
			}
		]
	}
	actions[ActionId.TriggerAutofocus] = {
		label: 'Camera trigger auto focus',
		options: [
			{
				label: 'CameraId',
				id: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1
			}
		]
	}
	actions[ActionId.CameraRamp] = {
		label: 'Set camera ramp',
		options: [
			{
				label: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1,
				id: 'CameraId'
			},
			{
				label: 'Pan',
				type: 'dropdown',
				choices: [
					{ label: 'Left', id: 'Left' },
					{ label: 'Right', id: 'Right' },
					{ label: 'Stop', id: 'Stop' }
				],
				default: 'Stop',
				id: 'Pan'
			},
			{
				label: 'PanSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'PanSpeed'
			},
			{
				label: 'Tilt',
				type: 'dropdown',
				choices: [
					{ label: 'Down', id: 'Down' },
					{ label: 'Up', id: 'Up' },
					{ label: 'Stop', id: 'Stop' }
				],
				default: 'Stop',
				id: 'Tilt'
			},
			{
				label: 'TiltSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'TiltSpeed'
			},
			{
				label: 'Zoom',
				type: 'dropdown',
				choices: [
					{ label: 'In', id: 'In' },
					{ label: 'Out', id: 'Out' },
					{ label: 'Stop', id: 'Stop' }
				],
				default: 'Stop',
				id: 'Zoom'
			},
			{
				label: 'ZoomSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'ZoomSpeed'
			},
			{
				label: 'Focus',
				type: 'dropdown',
				choices: [
					{ label: 'Far', id: 'Far' },
					{ label: 'Near', id: 'Near' },
					{ label: 'Stop', id: 'Stop' }
				],
				default: 'Stop',
				id: 'Focus'
			}
		]
	}
	actions[ActionId.DTMFSend] = {
		label: 'DTMF Send',
		options: [
			{
				label: 'CallId',
				id: 'CallId',
				type: 'number',
				min: 0,
				max: 65534,
				default: 0
			},
			{
				label: 'DTMFString',
				id: 'DTMFString',
				type: 'textinput',
				default: ''
			}
		]
	}
	actions[ActionId.ConferenceDoNotDisturbActivate] = {
		label: 'Conference Do Not Disturb Activate',
		options: [
			{
				label: 'Timeout',
				id: 'Timeout',
				type: 'number',
				min: 1,
				max: 1440,
				default: 1
			}
		]
	}
	actions[ActionId.ConferenceDoNotDisturbDeActivate] = {
		label: 'Conference Do Not Disturb deactivate',
		options: []
	}
	actions[ActionId.SelfView] = {
		label: 'Video: Self view',
		options: [
			WebexOnOffBooleanDropdown('Mode', 'Mode'),
			WebexOnOffBooleanDropdown('FullscreenMode', 'FullscreenMode'),
			{
				label: 'PIP Position',
				id: 'PIPPosition',
				type: 'dropdown',
				choices: [
					{ id: 'LowerLeft', label: 'LowerLeft' },
					{ id: 'LowerRight', label: 'LowerRight' },
					{ id: 'UpperLeft', label: 'UpperLeft' },
					{ id: 'UpperRight', label: 'UpperRight' }
				],
				default: 'LowerLeft'
			},
			{
				label: 'OnMonitorRole',
				id: 'OnMonitorRole',
				type: 'dropdown',
				choices: [
					{ id: 'First', label: 'First' },
					{ id: 'Second', label: 'Second' },
					{ id: 'Third', label: 'Third' }
				],
				default: 'First'
			}
		]
	}
	actions[ActionId.OSDKeyClick] = {
		label: 'OSD Key Click',
		options: [RemoteKeyToPressDropdown()]
	}
	actions[ActionId.OSDKeyPress] = {
		label: 'OSD Key Press',
		options: [RemoteKeyToPressDropdown()]
	}
	actions[ActionId.OSDKeyRelease] = {
		label: 'OSD Key Release',
		options: [RemoteKeyToPressDropdown()]
	}
	actions[ActionId.CameraBackground] = {
		label: 'Set Camera background',
		options: [
			{
				label: 'Image',
				id: 'Image',
				type: 'dropdown',
				choices: [
					{ id: 'Image1', label: 'Image1' },
					{ id: 'Image2', label: 'Image2' },
					{ id: 'Image3', label: 'Image3' },
					{ id: 'Image4', label: 'Image4' },
					{ id: 'Image5', label: 'Image5' },
					{ id: 'Image6', label: 'Image6' },
					{ id: 'Image7', label: 'Image7' },
					{ id: 'User1', label: 'User1' },
					{ id: 'User2', label: 'User2' },
					{ id: 'User3', label: 'User3' }
				],
				default: 'Image1'
			},
			{
				label: 'Mode',
				id: 'Mode',
				type: 'dropdown',
				choices: [
					{ id: 'Disabled', label: 'Disabled' },
					{ id: 'Blur', label: 'Blur' },
					{ id: 'BlurMonochrome', label: 'BlurMonochrome' },
					{ id: 'DepthOfField', label: 'DepthOfField' },
					{ id: 'Hdmi', label: 'Hdmi' },
					{ id: 'Monochrome', label: 'Monochrome' },
					{ id: 'Image', label: 'Image' },
					{ id: 'UsbC', label: 'UsbC' }
				],
				default: 'Image'
			}
		]
	}
	actions[ActionId.VideoMonitors] = {
		label: 'Monitor role',
		options: [
			{
				label: 'Monitors',
				id: 'Monitors',
				type: 'dropdown',
				choices: [
					{ id: 'Auto', label: 'Auto' },
					{ id: 'Single', label: 'Single' },
					{ id: 'Dual', label: 'Dual' },
					{ id: 'DualPresentationOnly', label: 'DualPresentationOnly' },
					{ id: 'TriplePresentationOnly', label: 'TriplePresentationOnly' },
					{ id: 'Triple', label: 'Triple' }
				],
				default: 'Auto'
			}
		]
	}
	actions[ActionId.VideoOutputMonitorRole] = {
		label: 'Set output connector monitor role',
		options: [
			{
				label: 'Connector',
				id: 'Connector',
				default: 1,
				type: 'number',
				min: 1,
				max: 3
			},
			{
				label: 'MonitorRole',
				id: 'MonitorRole',
				type: 'dropdown',
				choices: [
					{ id: 'Auto', label: 'Auto' },
					{ id: 'First', label: 'First' },
					{ id: 'Second', label: 'Second' },
					{ id: 'Third', label: 'Third' },
					{ id: 'PresentationOnly', label: 'PresentationOnly' },
					{ id: 'Recorder', label: 'Recorder' }
				],
				default: 'Auto'
			}
		]
	}
	actions[ActionId.MessageSend] = {
		label: 'Send message to any listening client',
		options: [
			{
				label: 'Text',
				type: 'textinput',
				id: 'Text',
				default: ''
			}
		]
	}
	actions[ActionId.StandbyControl] = {
		label: 'Device standby',
		options: [WebexOnOffBooleanDropdown('Standby', 'Standby')]
	}
	actions[ActionId.StandbyControl] = {
		label: 'Set Standby Delay',
		options: [
			{
				label: 'Delay in minutes',
				type: 'number',
				min: 1,
				max: 480,
				id: 'Delay',
				default: 10
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
			case ActionId.CustomConfiguration: {
				command.id = '0'
				command.method = 'xSet'
				command.params = { Path: opt.path?.toString().split(','), Value: opt.Value }
				break
			}
			case ActionId.CustomCommand: {
				command.id = '0'
				command.method = String(opt.Method)
				command.params = JSON.parse(String(opt.Params)) 
				break
			}
			case ActionId.Dial: {
				command.id = '1'
				command.method = 'xCommand/Dial'
				command.params = { Number: opt.number }
				break
			}
			case ActionId.Disconnect: {
				const callId = parseInt(String(opt.CallId))

				command.id = '2'
				command.method = 'xCommand/Call/Disconnect'
				command.params = { CallId: callId }
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
			case ActionId.VideoMatrix: {
				const sourceId = parseInt(String(opt.SourceId))

				command.id = '126'
				command.method = 'xCommand/Video/Matrix/Assign'
				command.params = {
					Layout: opt.Layout,
					Mode: opt.Mode,
					Output: opt.Output,
					RemoteMain: opt.RemoteMain,
					SourceId: sourceId
				}
				break
			}
			case ActionId.CameraPreset: {
				const preset = parseInt(String(opt.PresetId))
				command.id = '127'
				command.method = 'xCommand/Camera/Preset/Activate'
				command.params = { PresetId: preset }
				break
			}
			case ActionId.SetMainVideoSource: {
				const connectorId = parseInt(String(opt.ConnectorId))
				const sourceId = parseInt(String(opt.SourceId))

				command.id = '128'
				command.method = 'xCommand/Video/Input/SetMainVideoSource'
				command.params = {
					ConnectorId: connectorId,
					Layout: opt.Layout,
					PIPPosition: opt.PIPPosition,
					PIPSize: opt.PIPSize,
					SourceId: sourceId
				}
				break
			}
			case ActionId.CameraPositionSet: {
				const cameraId = parseInt(String(opt.CameraId))
				const focus = parseInt(String(opt.Focus))
				const pan = parseInt(String(opt.Pan))
				const roll = parseInt(String(opt.Roll))
				const tilt = parseInt(String(opt.Tilt))
				const zoom = parseInt(String(opt.Zoom))

				command.id = '129'
				command.method = 'xCommand/Camera/PositionSet'
				command.params = {
					CameraId: cameraId,
					Focus: focus,
					Lens: opt.Lens,
					Pan: pan,
					Roll: roll,
					Tilt: tilt,
					Zoom: zoom
				}
				break
			}
			case ActionId.VideoMatrixReset: {
				const output = parseInt(String(opt.Output))
				command.id = '130'
				command.method = 'xCommand/Video/Matrix/Reset'
				command.params = { Output: output }
				break
			}
			case ActionId.TriggerAutofocus: {
				const cameraId = parseInt(String(opt.CameraId))
				command.id = '131'
				command.method = 'xCommand/Camera/TriggerAutofocus'
				command.params = { CameraId: cameraId }
				break
			}
			case ActionId.CameraRamp: {
				const cameraId = parseInt(String(opt.CameraId))
				const panSpeed = parseInt(String(opt.PanSpeed))
				const tiltSpeed = parseInt(String(opt.TiltSpeed))
				const zoomSpeed = parseInt(String(opt.ZoomSpeed))

				command.id = '132'
				command.method = 'xCommand/Camera/Ramp'
				command.params = {
					CameraId: cameraId,
					Pan: opt.Pan,
					PanSpeed: panSpeed,
					Tilt: opt.Tilt,
					TiltSpeed: tiltSpeed,
					Zoom: opt.Zoom,
					ZoomSpeed: zoomSpeed,
					Focus: opt.Focus
				}
				break
			}
			case ActionId.DTMFSend: {
				const callId = parseInt(String(opt.CallId))
				command.id = '133'
				command.method = 'xCommand/Call/DTMFSend'
				command.params = {
					CallId: callId,
					DTMFString: opt.DTMFString
				}
				break
			}
			case ActionId.ConferenceDoNotDisturbActivate: {
				const timeout = parseInt(String(opt.Timeout))
				command.id = '134'
				command.method = 'xCommand/Conference/DoNotDisturb/Activate'
				command.params = {
					Timeout: timeout
				}
				break
			}
			case ActionId.ConferenceDoNotDisturbDeActivate: {
				command.id = '135'
				command.method = 'xCommand/Conference/DoNotDisturb/Deactivate'
				break
			}
			case ActionId.SelfView: {
				command.id = '136'
				command.method = 'xCommand/Video/Selfview/Set'
				command.params = {
					Mode: opt.Mode,
					FullscreenMode: opt.FullscreenMode,
					PIPPosition: opt.PIPPosition,
					OnMonitorRole: opt.OnMonitorRole
				}
				break
			}
			case ActionId.OSDKeyClick: {
				command.id = '137'
				command.method = 'xCommand/UserInterface/OSD/Key/Click'
				command.params = {
					Key: opt.Key
				}
				break
			}
			case ActionId.OSDKeyPress: {
				command.id = '138'
				command.method = 'xCommand/UserInterface/OSD/Key/Press'
				command.params = {
					Key: opt.Key
				}
				break
			}
			case ActionId.OSDKeyRelease: {
				command.id = '139'
				command.method = 'xCommand/UserInterface/OSD/Key/Release'
				command.params = {
					Key: opt.Key
				}
				break
			}
			case ActionId.CameraBackground: {
				command.id = '140'
				command.method = 'xCommand/Cameras/Background/Set'
				command.params = {
					Image: opt.Image,
					Mode: opt.Mode
				}
				break
			}
			case ActionId.VideoMonitors: {
				command.id = '141'
				command.method = 'xSet'
				command.params = { Path: ['Configuration', 'Video', 'Monitors'], Value: opt.Monitors }
				break
			}
			case ActionId.VideoOutputMonitorRole: {
				const connector = parseInt(String(opt.Connector))
				command.id = '142'
				command.method = 'xSet'
				command.params = { Path: ['Configuration', 'Video', 'Output', 'Connector', connector, 'MonitorRole'], Value: opt.MonitorRole }
				break
			}
			case ActionId.MessageSend: {
				command.id = '143'
				command.method = 'xCommand/Message/Send'
				command.params = {
					Text: opt.Text
				}
				break
			}
			case ActionId.StandbyControl: {
				command.id = '144'
				command.method = 'xSet'
				command.params = { Path: ['xConfiguration', 'Standby', 'Control'], Value: opt.Standby}
				break
			}
			case ActionId.StandbyDelay: {
				const delay = parseInt(String(opt.Delay))
				command.id = '145'
				command.method = 'xSet'
				command.params = { Path: ['xConfiguration', 'Standby', 'Delay'], Value: delay}
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
