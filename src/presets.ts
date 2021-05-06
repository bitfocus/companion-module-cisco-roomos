import InstanceSkel = require('../../../instance_skel')
import { CompanionPreset } from '../../../instance_skel_types'
import { ActionId } from './actions'
import { DeviceConfig } from './config'
import { FeedbackId } from './feedback'

interface CompanionPresetExt extends CompanionPreset {
	feedbacks: Array<
		{
			type: FeedbackId
		} & CompanionPreset['feedbacks'][0]
	>
	actions: Array<
		{
			action: ActionId
		} & CompanionPreset['actions'][0]
	>
}

export function GetPresetsList(instance: InstanceSkel<DeviceConfig>): CompanionPreset[] {
	const presets: CompanionPresetExt[] = []

	presets.push({
		category: 'General functions',
		label: `Dial`,
		bank: {
			style: 'text',
			text: `Dial`,
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.HasOutgoingCall,
				options: {
					bg: instance.rgb(0, 255, 0),
					fg: instance.rgb(0, 0, 0)
				}
			}
		],
		actions: [
			{
				action: ActionId.Dial,
				options: {
					number: ''
				}
			}
		]
	})
	presets.push({
		category: 'Audio',
		label: `Audio volume`,
		bank: {
			style: 'text',
			text: `Audio volume`,
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.Volume,
				options: {
					volume: 80
				}
			}
		]
	})
	presets.push({
		category: 'Audio',
		label: `Microphone mute`,
		bank: {
			style: 'text',
			text: `Microphone mute`,
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.MicrophoneMute,
				options: {
					bg: instance.rgb(255, 0, 0),
					fg: instance.rgb(255, 255, 255)
				}
			}
		],
		actions: [
			{
				action: ActionId.MicrophoneMute,
				options: {
					Mute: 'On'
				}
			}
		]
	})
	presets.push({
		category: 'General functions',
		label: `Accept all calls`,
		bank: {
			style: 'text',
			text: `Accept call`,
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.Accept,
				options: {}
			}
		]
	})
	presets.push({
		category: 'General functions',
		label: `Disconnect`,
		bank: {
			style: 'text',
			text: `Disconnect`,
			size: '7',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.Disconnect,
				options: {
					CallId: 0
				}
			}
		]
	})
	presets.push({
		category: 'General functions',
		label: `Auto-answer mode`,
		bank: {
			style: 'text',
			text: `AA\\n$(int:autoanswer_mode)`,
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.AutoAnswer,
				options: {
					bg: instance.rgb(255, 255, 255),
					fg: instance.rgb(0, 0, 0)
				}
			}
		],
		actions: [
			{
				action: ActionId.AutoAnswerMode,
				options: {
					Mode: 'On'
				}
			}
		]
	})
	presets.push({
		category: 'Visual buttons',
		label: `Show active ingoing calls`,
		bank: {
			style: 'text',
			text: `Ingoing\\n$(int:ingoing_calls)`,
			size: '14',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.HasIngoingCall,
				options: {
					bg: instance.rgb(0, 255, 0),
					fg: instance.rgb(0, 0, 0)
				}
			}
		],
		actions: []
	})
	presets.push({
		category: 'Visual buttons',
		label: `Show active outgoing calls`,
		bank: {
			style: 'text',
			text: `Outgoing\\n$(int:outgoing_calls)`,
			size: '14',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.HasOutgoingCall,
				options: {
					bg: instance.rgb(0, 255, 0),
					fg: instance.rgb(0, 0, 0)
				}
			}
		],
		actions: []
	})
	presets.push({
		category: 'Visual buttons',
		label: `Show ingoing ringing calls`,
		bank: {
			style: 'text',
			text: `Ringing\\n$(int:ingoing_ringing_calls)`,
			size: '14',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [
			{
				type: FeedbackId.Ringing,
				options: {
					bg: instance.rgb(0, 255, 0),
					fg: instance.rgb(0, 0, 0)
				}
			}
		],
		actions: []
	})
	presets.push({
		category: 'Custom',
		label: `Custom xConfiguration`,
		bank: {
			style: 'text',
			text: 'custom\\nxConfiguration',
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.CustomConfiguration,
				options: {
					path: 'Conference AutoAnswer Mode',
					Value: 'On'
				}
			}
		]
	})
	presets.push({
		category: 'Custom',
		label: `Custom xCommand`,
		bank: {
			style: 'text',
			text: 'custom\\nxCommand',
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.CustomCommand,
				options: {
					Method: 'Dial',
					Params: '{"Number":"123456789@meet24.webex.com"}'
				}
			}
		]
	})
	presets.push({
		category: 'OSD',
		label: `OSD Key Click`,
		bank: {
			style: 'text',
			text: 'OSD Click',
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.OSDKeyClick,
				options: {}
			}
		]
	})
	presets.push({
		category: 'OSD',
		label: `OSD Key Press`,
		bank: {
			style: 'text',
			text: 'OSD Press',
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.OSDKeyPress,
				options: {}
			}
		]
	})
	presets.push({
		category: 'OSD',
		label: `OSD Key Release`,
		bank: {
			style: 'text',
			text: 'OSD Release',
			size: '18',
			color: instance.rgb(255, 255, 255),
			bgcolor: instance.rgb(0, 0, 0)
		},
		feedbacks: [],
		actions: [
			{
				action: ActionId.OSDKeyRelease,
				options: {}
			}
		]
	})

	

	return presets
}
