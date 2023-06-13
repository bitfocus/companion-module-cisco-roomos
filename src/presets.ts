import { CompanionPresetDefinitions, combineRgb } from '@companion-module/base'
import { ActionId } from './actions'
import { FeedbackId } from './feedback'

export function GetPresetsList(): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	presets['general_dial'] = {
		type: 'button',
		category: 'General functions',
		name: `Dial`,
		style: {
			text: `Dial`,
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.HasOutgoingCall,
				options: {
					bg: combineRgb(0, 255, 0),
					fg: combineRgb(0, 0, 0)
				}
			}
		],
		steps: [
			{
				down: [
					{
						actionId: ActionId.Dial,
						options: {
							number: ''
						}
					}
				],
				up: []
			}
		]
	}
	presets['audio_volume'] = {
		type: 'button',
		category: 'Audio',
		name: `Audio volume`,
		style: {
			text: `Audio volume`,
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.Volume,
						options: {
							volume: 80
						}
					}
				],
				up: []
			}
		]
	}
	presets['audio_mic_mute'] = {
		type: 'button',
		category: 'Audio',
		name: `Microphone mute`,
		style: {
			text: `Microphone mute`,
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.MicrophoneMute,
				options: {
					bg: combineRgb(255, 0, 0),
					fg: combineRgb(255, 255, 255)
				}
			}
		],
		steps: [
			{
				down: [
					{
						actionId: ActionId.MicrophoneMute,
						options: {
							Mute: 'On'
						}
					}
				],
				up: []
			}
		]
	}
	presets['general_accept_all_calls'] = {
		type: 'button',
		category: 'General functions',
		name: `Accept all calls`,
		style: {
			text: `Accept call`,
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.Accept,
						options: {}
					}
				],
				up: []
			}
		]
	}
	presets['general_disconnect'] = {
		type: 'button',
		category: 'General functions',
		name: `Disconnect`,
		style: {
			text: `Disconnect`,
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.Disconnect,
						options: {
							CallId: 0
						}
					}
				],
				up: []
			}
		]
	}
	presets['general_auto_answer'] = {
		type: 'button',
		category: 'General functions',
		name: `Auto-answer mode`,
		style: {
			text: `AA\\n$(int:autoanswer_mode)`,
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.AutoAnswer,
				options: {
					bg: combineRgb(255, 255, 255),
					fg: combineRgb(0, 0, 0)
				}
			}
		],
		steps: [
			{
				down: [
					{
						actionId: ActionId.AutoAnswerMode,
						options: {
							Mode: 'On'
						}
					}
				],
				up: []
			}
		]
	}
	presets['visual_show_ingoing_calls'] = {
		type: 'button',
		category: 'Visual buttons',
		name: `Show active ingoing calls`,
		style: {
			text: `Ingoing\\n$(int:ingoing_calls)`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.HasIngoingCall,
				options: {
					bg: combineRgb(0, 255, 0),
					fg: combineRgb(0, 0, 0)
				}
			}
		],
		steps: [
			{
				down: [],
				up: []
			}
		]
	}
	presets['visual_show_outgoing_calls'] = {
		type: 'button',
		category: 'Visual buttons',
		name: `Show active outgoing calls`,
		style: {
			text: `Outgoing\\n$(int:outgoing_calls)`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.HasOutgoingCall,
				options: {
					bg: combineRgb(0, 255, 0),
					fg: combineRgb(0, 0, 0)
				}
			}
		],
		steps: [
			{
				down: [],
				up: []
			}
		]
	}
	presets['visual_show_ingoing_ringing_calls'] = {
		type: 'button',
		category: 'Visual buttons',
		name: `Show ingoing ringing calls`,
		style: {
			text: `Ringing\\n$(int:ingoing_ringing_calls)`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [
			{
				feedbackId: FeedbackId.Ringing,
				options: {
					bg: combineRgb(0, 255, 0),
					fg: combineRgb(0, 0, 0)
				}
			}
		],
		steps: [
			{
				down: [],
				up: []
			}
		]
	}
	presets['custom-xconfig'] = {
		type: 'button',
		category: 'Custom',
		name: `Custom xConfiguration`,
		style: {
			text: 'custom\\nxConfiguration',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.CustomConfiguration,
						options: {
							path: 'Conference AutoAnswer Mode',
							Value: 'On'
						}
					}
				],
				up: []
			}
		]
	}
	presets['custom_xcommand'] = {
		type: 'button',
		category: 'Custom',
		name: `Custom xCommand`,
		style: {
			text: 'custom\\nxCommand',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.CustomCommand,
						options: {
							Method: 'Dial',
							Params: '{"Number":"123456789@meet24.webex.com"}'
						}
					}
				],
				up: []
			}
		]
	}
	presets['osd_key_click'] = {
		type: 'button',
		category: 'OSD',
		name: `OSD Key Click`,
		style: {
			text: 'OSD Click',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.OSDKeyClick,
						options: {}
					}
				],
				up: []
			}
		]
	}
	presets['osd_key_press'] = {
		type: 'button',
		category: 'OSD',
		name: `OSD Key Press`,
		style: {
			text: 'OSD Press',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.OSDKeyPress,
						options: {}
					}
				],
				up: []
			}
		]
	}
	presets['osd_key_release'] = {
		type: 'button',
		category: 'OSD',
		name: `OSD Key Release`,
		style: {
			text: 'OSD Release',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0)
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: ActionId.OSDKeyRelease,
						options: {}
					}
				],
				up: []
			}
		]
	}

	return presets
}
