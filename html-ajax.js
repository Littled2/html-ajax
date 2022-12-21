window.addEventListener("load", ajax_init)


function ajax_init() {

    window.ajax = {}
    window.ajax.listeners = {}

    document.querySelectorAll("*[ajax-get]").forEach(el => {

        // Get the URL of the requested resource
        let url = el.getAttribute("ajax-get")
    
        // Get and parse any options proveded by the ajax-options attribute
        let options = el.getAttribute("ajax-options")
        if(options) {
            options = parse_options(options)
        }

        // Get the parser function if there is a parser function
        let parser = get_valid_function(el.getAttribute("ajax-parser"))

        // If this request is to be repeated, then a trigger will be used
        let listener = el.getAttribute("ajax-listener")
        if(listener) {
            // Add this element to its respective listener

            // Check if listener already exists
            if(!Object(window.ajax.listeners).hasOwnProperty(listener)) {
                window.ajax.listeners[listener] =  []
            }

            window.ajax.listeners[listener].push([ url, el, parser, options ])
        }    
        
        // Exit early if the ajax query is not supposed to be run initially
        if(el.hasAttribute("ajax-defer")) return

        // Make the AJAX request
        ajax_get(url, el, parser, options)
    })



    // Get elements that trigger ajax events
    document.querySelectorAll("*[ajax-update]").forEach(el => {

        // Get the name of this trigger
        let trigger_name =  el.getAttribute("ajax-update")
        if(!trigger_name) return

        // Get the event that causes the trigger, default to click
        let event_name = el.getAttribute("ajax-trigger")
        if(!event_name) event_name = "click"

        console.log(el, trigger_name, event_name)
        el.addEventListener(event_name, () => ajax_event(trigger_name))

    })



    function ajax_event(name) {
        
        // Executes an ajax event
        if(!Object(window.ajax.listeners).hasOwnProperty(name)) return

        for (let i = 0; i < window.ajax.listeners[name].length; i++) {
            const [ url, el, parser, options ] = window.ajax.listeners[name][i]
            // Gets the paramaters for this listening element
            ajax_get(url, el, parser, options)
        }
    }
    
    
    async function ajax_get(url, element, parser, options) {
        let response
        try {
            response = await (await fetch(url)).text()
        } catch (error) {
            report_error(`something went wrong fetching data from ${url}`, error)
        }
    
        // Check if there is a parser function to parse the data
        // Otherwise just write the exact response
        if(parser) {
            // If the user requested JSON data, then pass the response to the parser function as parsed JSON
            response = options.json ? execute_parser(parser, JSON.parse(response)) : execute_parser(parser, response)        
        }
        element.innerHTML = response
    }
    
    
    
    function parse_options(options_string) {
        // Returns an object with the key-values contained in the options_string
        let options = {}
    
        try {
    
            options_string.trim()
    
            // Split options into key-value pairs
            let key_vals = options_string.replace(/ /g, "").split(",")
    
            for (let i = 0; i < key_vals.length; i++) {
    
                // Get key and value pairs from each option
                let [k, v] = key_vals[i].split(":")
    
                // Handle boolean values
                if(v === "true") {
                    v = true
                } else if (v === "false") {
                    v = false
                }
    
                // Assign the value to this key on the options object
                options[k] = v
            }
    
            return options
    
        } catch (error) {
            report_error("Malformed options string", error)
            return {}
        }
    }
    
    
    
    function get_valid_function(parser_name) {
        if(parser_name && Object(window).hasOwnProperty(parser_name)  && typeof window[parser_name] === "function") {
            return window[parser_name]
        }
        return null
    }
    
    
    
    function execute_parser(parser, data) {
        try {
            return parser(data)
        } catch (error) {
            report_error(`error parsing data from ${url}`, error)
            return 'An error occured'
        }
    }
    
    
    
    function report_error(message, error) {
        if(error) console.error(error)
        console.error(`${error ? 'INFO ABOUT THE ABOVE ERROR \n' : ''}ajax-get error: ${message}`)
    }
}