import InstanceSkel = require('../../../instance_skel')
import { CompanionVariable } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export function InitVariables(instance: InstanceSkel<DeviceConfig>): void {
	const variables: CompanionVariable[] = []

	// variables.push({
	// 	label: `Number of outgoing calls`,
	// 	name: `outgoing_calls`
	// })
	// variables.push({
	// 	label: `Number of ingoing calls`,
	// 	name: `ingoing_calls`
	// })
	// variables.push({
	// 	label: `Number of ingoing actively ringing calls`,
	// 	name: `ingoing_ringing_calls`
	// })
	variables.push({
		label: `Auto answer activated`,
		name: `autoanswer_mode`
	})
	variables.push({
		label: `Incoming call will be muted (on)`,
		name: `autoanswer_mute`
	})
	variables.push({
		label: `Autoanswer delay`,
		name: `autoanswer_delay`
	})
	variables.push({
		label: `System Time on connection`,
		name: `systemtime`
	})
	variables.push({
		label: 'Audio: Selected device',
		name: 'selected_device'
	})
	variables.push({
		label: 'Audio: Volume',
		name: 'volume'
	})
	variables.push({
		label: 'Audio: Microphones Music Mode',
		name: 'microphones_musicmode'
	})
	variables.push({
		label: 'Audio: Microphones Mute',
		name: 'microphones_mute'
	})
	variables.push({
		label: 'Audio: connectors mute',
		name: 'audio_connector_mute'
	})
	variables.push({
		label: 'Conference: Do not disturb',
		name: 'DoNotDisturb'
	})
	variables.push({
		label: 'Conference: Presentation',
		name: 'Presentation'
	})
	variables.push({
		label: 'Conference: SelectedCallProtocol',
		name: 'SelectedCallProtocol'
	})

	// instance.setVariable('outgoing_calls', '0')
	// instance.setVariable('ingoing_calls', '0')
	// instance.setVariable('ingoing_ringing_calls', '0')

	instance.setVariableDefinitions(variables)
}
