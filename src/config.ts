import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface DeviceConfig {
	host?: string
	username?: string
	password: string
	protocol: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Note',
			value: 'This module is for connecting to Cisco Webex hardware like DX80 or Codec Pro K7, etc.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device Host/IP',
			width: 12,
			regex: Regex.IP,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			regex: Regex.SOMETHING,
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6,
			default: '',
		},
		{
			type: 'dropdown',
			id: 'protocol',
			label: 'Connection protocol',
			width: 6,
			choices: [
				{ id: 'wss', label: 'Websocket' },
				{ id: 'ssh', label: 'ssh' },
			],
			default: 'ssh',
		},
	]
}
