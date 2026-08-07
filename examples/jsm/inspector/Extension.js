import { Tab } from '@tnb1j/4js/addons/inspector/ui/Tab.js';

export class Extension extends Tab {

	constructor( name, options = {} ) {

		super( name, options );

		this.isExtension = true;

	}

}
