import { WebexInstanceSkel } from './webex.js'
import { DeviceConfig } from './config.js'
import {
	CompanionActionDefinitions,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	Regex,
} from '@companion-module/base'

export enum ActionId {
	CustomConfiguration = 'custom_configuration',
	CustomCommand = 'custom_command',
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
	StandbyDelay = 'standby_control',
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
				id: 'On',
			},
			{
				label: 'Off',
				id: 'Off',
			},
		],
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
			{ label: '-', id: '-' },
		],
	}
}
function ConnectorIdNumber(): CompanionInputFieldNumber {
	return {
		label: 'ConnectorId',
		id: 'ConnectorId',
		default: 1,
		type: 'number',
		min: 1,
		max: 8,
	}
}
function SourceIdNumber(): CompanionInputFieldNumber {
	return {
		label: 'SourceId',
		id: 'SourceId',
		default: 1,
		type: 'number',
		min: 1,
		max: 255,
	}
}

export function GetActionsList(instance: WebexInstanceSkel<DeviceConfig>): CompanionActionDefinitions {
	const actions: CompanionActionDefinitions = {}

	actions[ActionId.CustomConfiguration] = {
		name: 'Custom xConfiguration',
		options: [
			{
				type: 'textinput',
				label: 'Path (use spaces)',
				id: 'path',
				default: 'Conference AutoAnswer Mode',
				regex: Regex.SOMETHING,
			},
			{
				type: 'textinput',
				label: 'Value',
				id: 'Value',
				default: '',
				regex: Regex.SOMETHING,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.config.set(`'${opt.path}'`, String(opt.Value))
		},
	}
	actions[ActionId.CustomCommand] = {
		name: 'Custom xCommand',
		options: [
			{
				type: 'textinput',
				label: 'Method',
				id: 'Method',
				default: 'Dial',
				regex: Regex.SOMETHING,
			},
			{
				type: 'textinput',
				label: 'Params (Put in JSON format)',
				id: 'Params',
				default: '{"Number":"123456789@meet24.webex.com"}',
				regex: Regex.SOMETHING,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi
				?.command(`'${opt.Method}'`, JSON.parse(String(opt.Params)))
				.catch((e: any) => instance.log('warn', `Webex: Dial failed: ${e.message}`))
		},
	}
	actions[ActionId.Dial] = {
		name: 'Call: Dial',
		options: [
			{
				type: 'textinput',
				label: 'Address to call',
				id: 'number',
				default: '',
				regex: Regex.SOMETHING,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.dial({ Number: opt.number }).catch((e: unknown) =>
				instance.log('warn', `Webex: Dial failed: ${e}`)
			)
		},
	}
	actions[ActionId.Disconnect] = {
		name: 'Call: Disconnect',
		options: [
			{
				label: 'Call ID 0 = All',
				id: 'CallId',
				type: 'number',
				min: 0,
				max: 255,
				default: 0,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const callId = parseInt(String(opt.CallId))
			await instance.xapi?.Command.Call.disconnect({ CallId: callId }).catch((e: unknown) =>
				instance.log('warn', `Webex: Dial failed: ${e}`)
			)
		},
	}
	actions[ActionId.Accept] = {
		name: 'Call: Accept all incoming calls',
		options: [],
		callback: async (): Promise<void> => {
			await instance.xapi?.Command.Call.Accept() // If no ID is passed all are accepted
		},
	}
	actions[ActionId.AutoAnswerMode] = {
		name: 'Call: Configure auto-answer mode',
		options: [WebexOnOffBooleanDropdown('Mode', 'Mode')],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Config.Conference.AutoAnswer.Mode.set(opt.Mode)
		},
	}
	actions[ActionId.AutoAnswerMute] = {
		name: 'Call: Configure auto-answer mute',
		options: [WebexOnOffBooleanDropdown('Mute', 'Mute')],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Config.Conference.AutoAnswer.Mute.set(opt.Mute)
		},
	}
	actions[ActionId.AutoAnswerDelay] = {
		name: 'Call: Configure auto-answer delay',
		options: [
			{
				type: 'textinput',
				default: '0',
				label: 'Delay (in seconds)',
				id: 'Delay',
				regex: Regex.NUMBER,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const delay = parseInt(String(opt.Delay))
			await instance.xapi?.Config.Conference.AutoAnswer.Delay.set(delay)
		},
	}
	actions[ActionId.Volume] = {
		name: 'Audio: Volume',
		options: [
			{
				type: 'number',
				default: 80,
				label: 'level 0-100',
				min: 0,
				max: 100,
				id: 'volume',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const volume = parseInt(String(opt.volume))
			await instance.xapi?.Command.Audio.Volume.Set({ Level: volume })
		},
	}
	actions[ActionId.MicrophoneMute] = {
		name: 'Audio: Microphones Mute',
		options: [WebexOnOffBooleanDropdown('Mute', 'Mute')],
		callback: async (action): Promise<void> => {
			const opt = action.options

			if (opt.Mute == 'On') {
				await instance.xapi?.Command.Audio.Microphones.Mute()
			} else {
				await instance.xapi?.Command.Audio.Microphones.Unmute()
			}
		},
	}
	// actions[ActionId.MicrophoneInput] = {
	// 	name: 'Audio: Microphone input',
	// 	options: [],
	// 	callback: async (action): Promise<void> => {
	// 		const opt = action.options
	//		console.log('Input todo')
	// 	}
	// }
	actions[ActionId.MusicMode] = {
		name: 'Audio: Microphones Music Mode',
		options: [WebexOnOffBooleanDropdown('MusicMode', 'MusicMode')],
		callback: async (action): Promise<void> => {
			const opt = action.options

			if (opt.MusicMode == 'On') {
				await instance.xapi?.Command.Audio.Microphones.MusicMode.Start()
			} else {
				await instance.xapi?.Command.Audio.Microphones.MusicMode.Stop()
			}
		},
	}
	actions[ActionId.MicrophoneNoiseRemoval] = {
		name: 'Audio: Microphones Noise removal',
		options: [
			{
				label: 'Input',
				id: 'Input',
				type: 'number',
				min: 1,
				max: 8,
				default: 1,
			},
			WebexOnOffBooleanDropdown('NoiseRemoval', 'NoiseRemoval'),
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			if (opt.NoiseRemoval == 'On') {
				await instance.xapi?.Command.Audio.Microphone[1].EchoControl.NoiseReduction.On()
			} else {
				await instance.xapi?.Command.Audio.Microphone[1].EchoControl.NoiseReduction.Off()
			}
		},
	}
	actions[ActionId.Presentation] = {
		name: 'Presentation',
		options: [
			{
				label: 'Start/Stop',
				id: 'StartStop',
				type: 'dropdown',
				choices: [
					{ id: 'Start', label: 'Start' },
					{ id: 'Stop', label: 'Stop' },
				],
				default: 'Start',
			},
			ConnectorIdNumber(),
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
					{ id: '6', label: '6' },
				],
				default: 'new',
			},
			{
				label: 'Layout',
				id: 'Layout',
				type: 'dropdown',
				choices: [
					{ id: 'Equal', label: 'Equal' },
					{ id: 'Prominent', label: 'Prominent' },
				],
				default: 'Equal',
			},
			{
				label: 'Presentation Source',
				id: 'PresentationSource',
				default: '1',
				type: 'textinput',
			},
			{
				label: 'SendingMode',
				id: 'SendingMode',
				type: 'dropdown',
				choices: [
					{ id: 'LocalRemote', label: 'LocalRemote' },
					{ id: 'LocalOnly', label: 'LocalOnly' },
				],
				default: 'LocalRemote',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const connectorId = parseInt(String(opt.ConnectorId))
			const instances = String(opt.Instance) == 'New' ? String(opt.Instance) : parseInt(String(opt.Instance))
			const presentationSource =
				String(opt.PresentationSource) == 'None'
					? String(opt.PresentationSource)
					: parseInt(String(opt.PresentationSource))

			await instance.xapi?.Command.Presentation.start({
				ConnectorId: connectorId,
				Instance: instances,
				Layout: opt.Layout,
				PresentationSource: presentationSource,
				SendingMode: opt.SendingMode,
			})
		},
	}
	actions[ActionId.VideoMatrix] = {
		name: 'Video Matrix',
		options: [
			{
				label: 'Layout',
				id: 'Layout',
				type: 'dropdown',
				choices: [
					{ id: 'Equal', label: 'Equal' },
					{ id: 'Prominent', label: 'Prominent' },
				],
				default: 'Equal',
			},
			{
				label: 'Mode',
				id: 'Mode',
				type: 'dropdown',
				choices: [
					{ id: 'Add', label: 'Add' },
					{ id: 'Replace', label: 'Replace' },
				],
				default: 'Add',
			},
			{
				label: 'Output',
				id: 'Output',
				default: 1,
				type: 'number',
				min: 1,
				max: 3,
			},
			{
				label: 'RemoteMain',
				id: 'RemoteMain',
				default: 1,
				type: 'number',
				min: 1,
				max: 4,
			},
			SourceIdNumber(),
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const sourceId = parseInt(String(opt.SourceId))
			await instance.xapi?.Command.Video.Matrix.assign({
				Layout: opt.Layout,
				Mode: opt.Mode,
				Output: opt.Output,
				RemoteMain: opt.RemoteMain,
				SourceId: sourceId,
			})
		},
	}
	actions[ActionId.CameraPreset] = {
		name: 'Camera: Activate Camera preset',
		options: [
			{
				label: 'Preset number 1-35',
				type: 'number',
				default: 1,
				id: 'PresetId',
				min: 1,
				max: 35,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const preset = parseInt(String(opt.PresetId))
			await instance.xapi?.Command.Camera.Preset.Activate({ PresetId: preset })
		},
	}
	actions[ActionId.SetMainVideoSource] = {
		name: 'Set Main Video Source',
		options: [
			ConnectorIdNumber(),
			{
				label: 'Layout',
				id: 'Layout',
				type: 'dropdown',
				choices: [
					{ id: 'Equal', label: 'Equal' },
					{ id: 'PIP', label: 'PIP' },
					{ id: 'Prominent', label: 'Prominent' },
				],
				default: 'Equal',
			},
			{
				label: 'PIP Position',
				id: 'PIPPosition',
				type: 'dropdown',
				choices: [
					{ id: 'LowerLeft', label: 'LowerLeft' },
					{ id: 'LowerRight', label: 'LowerRight' },
					{ id: 'UpperLeft', label: 'UpperLeft' },
					{ id: 'UpperRight', label: 'UpperRight' },
				],
				default: 'LowerLeft',
			},
			{
				label: 'PIP Size',
				id: 'PIPSize',
				type: 'dropdown',
				choices: [
					{ id: 'Auto', label: 'Auto' },
					{ id: 'Large', label: 'Large' },
				],
				default: 'Auto',
			},
			SourceIdNumber(),
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const connectorId = parseInt(String(opt.ConnectorId))
			const sourceId = parseInt(String(opt.SourceId))
			await instance.xapi?.Command.Video.Input.SetMainVideoSource({
				ConnectorId: connectorId,
				Layout: opt.Layout,
				PIPPosition: opt.PIPPosition,
				PIPSize: opt.PIPSize,
				SourceId: sourceId,
			})
		},
	}
	actions[ActionId.CameraPositionSet] = {
		name: 'Set camera position',
		options: [
			{
				label: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1,
				id: 'CameraId',
			},
			{
				label: 'Focus',
				type: 'number',
				min: 0,
				max: 65535,
				default: 30000,
				id: 'Focus',
			},
			{
				label: 'Lens',
				type: 'dropdown',
				choices: [
					{ label: 'Wide', id: 'Wide' },
					{ label: 'Center', id: 'Center' },
					{ label: 'Left', id: 'Left' },
					{ label: 'Center', id: 'Center' },
				],
				default: 'Center',
				id: 'Lens',
			},
			{
				label: 'Pan',
				type: 'number',
				min: -17000,
				max: 17000,
				default: 0,
				id: 'Pan',
			},
			{
				label: 'Roll',
				type: 'number',
				min: -300,
				max: 300,
				default: 0,
				id: 'Pan',
			},
			{
				label: 'Tilt',
				type: 'number',
				min: -9000,
				max: 9000,
				default: 0,
				id: 'Pan',
			},
			{
				label: 'Zoom',
				type: 'number',
				min: 0,
				max: 11800,
				default: 5000,
				id: 'Zoom',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const cameraId = parseInt(String(opt.CameraId))
			const focus = parseInt(String(opt.Focus))
			const pan = parseInt(String(opt.Pan))
			const roll = parseInt(String(opt.Roll))
			const tilt = parseInt(String(opt.Tilt))
			const zoom = parseInt(String(opt.Zoom))
			await instance.xapi?.Command.Camera.PositionSet({
				CameraId: cameraId,
				Focus: focus,
				Lens: opt.Lens,
				Pan: pan,
				Roll: roll,
				Tilt: tilt,
				Zoom: zoom,
			})
		},
	}
	actions[ActionId.VideoMatrixReset] = {
		name: 'Video Matrix Reset',
		options: [
			{
				label: 'Output',
				type: 'number',
				min: 1,
				max: 3,
				default: 1,
				id: 'Output',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const output = parseInt(String(opt.Output))
			await instance.xapi?.Command.Video.Matrix.Reset({ Output: output })
		},
	}
	actions[ActionId.TriggerAutofocus] = {
		name: 'Camera trigger auto focus',
		options: [
			{
				label: 'CameraId',
				id: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const cameraId = parseInt(String(opt.CameraId))
			await instance.xapi?.Command.Camera.TriggerAutofocus({ CameraId: cameraId })
		},
	}
	actions[ActionId.CameraRamp] = {
		name: 'Set camera ramp',
		options: [
			{
				label: 'CameraId',
				type: 'number',
				min: 1,
				max: 7,
				default: 1,
				id: 'CameraId',
			},
			{
				label: 'Pan',
				type: 'dropdown',
				choices: [
					{ label: 'Left', id: 'Left' },
					{ label: 'Right', id: 'Right' },
					{ label: 'Stop', id: 'Stop' },
				],
				default: 'Stop',
				id: 'Pan',
			},
			{
				label: 'PanSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'PanSpeed',
			},
			{
				label: 'Tilt',
				type: 'dropdown',
				choices: [
					{ label: 'Down', id: 'Down' },
					{ label: 'Up', id: 'Up' },
					{ label: 'Stop', id: 'Stop' },
				],
				default: 'Stop',
				id: 'Tilt',
			},
			{
				label: 'TiltSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'TiltSpeed',
			},
			{
				label: 'Zoom',
				type: 'dropdown',
				choices: [
					{ label: 'In', id: 'In' },
					{ label: 'Out', id: 'Out' },
					{ label: 'Stop', id: 'Stop' },
				],
				default: 'Stop',
				id: 'Zoom',
			},
			{
				label: 'ZoomSpeed',
				type: 'number',
				min: 0,
				max: 15,
				default: 0,
				id: 'ZoomSpeed',
			},
			{
				label: 'Focus',
				type: 'dropdown',
				choices: [
					{ label: 'Far', id: 'Far' },
					{ label: 'Near', id: 'Near' },
					{ label: 'Stop', id: 'Stop' },
				],
				default: 'Stop',
				id: 'Focus',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const cameraId = parseInt(String(opt.CameraId))
			const panSpeed = parseInt(String(opt.PanSpeed))
			const tiltSpeed = parseInt(String(opt.TiltSpeed))
			const zoomSpeed = parseInt(String(opt.ZoomSpeed))
			await instance.xapi?.Command.Camera.Ramp({
				CameraId: cameraId,
				Pan: opt.Pan,
				PanSpeed: panSpeed,
				Tilt: opt.Tilt,
				TiltSpeed: tiltSpeed,
				Zoom: opt.Zoom,
				ZoomSpeed: zoomSpeed,
				Focus: opt.Focus,
			})
		},
	}
	actions[ActionId.DTMFSend] = {
		name: 'DTMF Send',
		options: [
			{
				label: 'CallId',
				id: 'CallId',
				type: 'number',
				min: 0,
				max: 65534,
				default: 0,
			},
			{
				label: 'DTMFString',
				id: 'DTMFString',
				type: 'textinput',
				default: '',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const callId = parseInt(String(opt.CallId))
			await instance.xapi?.Command.Call.DTMFSend({
				CallId: callId,
				DTMFString: opt.DTMFString,
			})
		},
	}
	actions[ActionId.ConferenceDoNotDisturbActivate] = {
		name: 'Conference Do Not Disturb Activate',
		options: [
			{
				label: 'Timeout',
				id: 'Timeout',
				type: 'number',
				min: 1,
				max: 1440,
				default: 1,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const timeout = parseInt(String(opt.Timeout))
			await instance.xapi?.Command.Conference.DoNotDisturb.Activate({
				Timeout: timeout,
			})
		},
	}
	actions[ActionId.ConferenceDoNotDisturbDeActivate] = {
		name: 'Conference Do Not Disturb deactivate',
		options: [],
		callback: async (): Promise<void> => {
			await instance.xapi?.Command.Conference.DoNotDisturb.Deactivate()
		},
	}
	actions[ActionId.SelfView] = {
		name: 'Video: Self view',
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
					{ id: 'UpperRight', label: 'UpperRight' },
				],
				default: 'LowerLeft',
			},
			{
				label: 'OnMonitorRole',
				id: 'OnMonitorRole',
				type: 'dropdown',
				choices: [
					{ id: 'First', label: 'First' },
					{ id: 'Second', label: 'Second' },
					{ id: 'Third', label: 'Third' },
				],
				default: 'First',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.Video.SelfView({
				Mode: opt.Mode,
				FullscreenMode: opt.FullscreenMode,
				PIPPosition: opt.PIPPosition,
				OnMonitorRole: opt.OnMonitorRole,
			})
		},
	}
	actions[ActionId.OSDKeyClick] = {
		name: 'OSD Key Click',
		options: [RemoteKeyToPressDropdown()],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.UserInterface.OSD.Key.Click({
				Key: opt.Key,
			})
		},
	}
	actions[ActionId.OSDKeyPress] = {
		name: 'OSD Key Press',
		options: [RemoteKeyToPressDropdown()],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.UserInterface.OSD.Key.Press({
				Key: opt.Key,
			})
		},
	}
	actions[ActionId.OSDKeyRelease] = {
		name: 'OSD Key Release',
		options: [RemoteKeyToPressDropdown()],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.UserInterface.OSD.Key.Release({
				Key: opt.Key,
			})
		},
	}
	actions[ActionId.CameraBackground] = {
		name: 'Set Camera background',
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
					{ id: 'User3', label: 'User3' },
				],
				default: 'Image1',
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
					{ id: 'UsbC', label: 'UsbC' },
				],
				default: 'Image',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.Cameras.Background.Set({
				Image: opt.Image,
				Mode: opt.Mode,
			})
		},
	}
	actions[ActionId.VideoMonitors] = {
		name: 'Monitor role',
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
					{ id: 'Triple', label: 'Triple' },
				],
				default: 'Auto',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Config.Video.Monitors.set(opt.Monitors)
		},
	}
	actions[ActionId.VideoOutputMonitorRole] = {
		name: 'Set output connector monitor role',
		options: [
			{
				label: 'Connector',
				id: 'Connector',
				default: 1,
				type: 'number',
				min: 1,
				max: 3,
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
					{ id: 'Recorder', label: 'Recorder' },
				],
				default: 'Auto',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const connector = parseInt(String(opt.Connector))
			await instance.xapi?.Config.Video.Output.Connector[connector].MonitorRole.set(opt.MonitorRole)
		},
	}
	actions[ActionId.MessageSend] = {
		name: 'Send message to any listening client',
		options: [
			{
				label: 'Text',
				type: 'textinput',
				id: 'Text',
				default: '',
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Command.Message.Send({
				Text: opt.Text,
			})
		},
	}
	actions[ActionId.StandbyControl] = {
		name: 'Device standby',
		options: [WebexOnOffBooleanDropdown('Standby', 'Standby')],
		callback: async (action): Promise<void> => {
			const opt = action.options

			await instance.xapi?.Config.Standby.Control.set(opt.Standby)
		},
	}
	actions[ActionId.StandbyControl] = {
		name: 'Set Standby Delay',
		options: [
			{
				label: 'Delay in minutes',
				type: 'number',
				min: 1,
				max: 480,
				id: 'Delay',
				default: 10,
			},
		],
		callback: async (action): Promise<void> => {
			const opt = action.options

			const delay = parseInt(String(opt.Delay))
			await instance.xapi?.Config.Standby.Delay.set(delay)
		},
	}
	return actions
}
