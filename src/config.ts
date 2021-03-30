import InstanceSkel = require('../../../instance_skel')
import { SomeCompanionConfigField } from '../../../instance_skel_types'

export interface DeviceConfig {
	host?: string
	username?: string
	password: string
}

export function GetConfigFields(self: InstanceSkel<DeviceConfig>): SomeCompanionConfigField[] {
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Note',
			value: 'This module is for connecting to Cisco Webex hardware like DX80 or Codec Pro K7, etc.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device Host/IP',
			width: 12,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			regex: self.REGEX_SOMETHING
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6,
			regex: self.REGEX_SOMETHING
		}
	]
}
