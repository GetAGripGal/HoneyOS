/**
 * The welcome message displayed in the console.
 * @type {string}
 */
const WELCOME_MESSAGE = `\
    ██░░░░██    
  ▓▓██░░░░██▓▓  
  ████▒▒▒▒████			
▒▒▒▒▓▓▓▓▓▓▓▓▒▒▒▒	Welcome to honeyos.net!
░░░░░░░░░░░░░░░░	-----------------------
  ▒▒▓▓▓▓▓▓▓▓▒▒  
  ██▒▒▒▒▒▒▒▒██  
    ████████    
`;

/**
 * Greet the user in the console.
 */
function greet() {
	console.log(WELCOME_MESSAGE);
}

export { greet, }
