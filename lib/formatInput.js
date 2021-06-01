class FormatInput {
	constructor(string) {
		this.stringLower = string.toLowerCase();
		this.stringFormatted =
			this.stringLower[0].toUpperCase() + this.stringLower.substring(1);
	}

	getString() {
		let string = this.stringFormatted;

		return string;
	}
}

module.exports = FormatInput;
