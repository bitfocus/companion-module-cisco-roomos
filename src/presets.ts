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
			text: `AA\\n$(int:18answer_mode)`,
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
		category: 'Visual buttons',
		label: `Device is ringing`,
		bank: {
			style: 'text',
			text: `Idle`,
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

	return presets
}
