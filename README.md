# HTML-AJAX

*Make AJAX requests, directly from your HTML*

The most simple use case:
```html
<div
    ajax-get="/url"
></div>
```
*Fetches the data from /url and writes it to the innerHTML of the div

## AJAX-Properties
All features of the HTML-AJAX library are implemented using optional HTML attributes

| Attribute Name | Attribute Value | Description |
| -------------- | --------------- | ----------- |
| ajax-get       | URL | Tells HTML-AJAX where to request data from |
| ajax-parser    | function_name | Optionally reference the name of a JavaScript function to parse what the request fetches |
| ajax-parse-json| n/a | Optionally parse the data as JSON |
| ajax-provide   | identifier | Provide the data returned from the request to elements that use "ajax-use" |
| ajax-use       | identifier | Allows an element to use data that has been provided elsewhere by an element using "ajax-provide". |
| ajax-no-write  | n/a | Prevents the default behavior where the data is written to the element. |
| ajax-write-as-text | n/a | Writes the data to the element's innerText rather than innerHTML. Useful to prevent XSS attack vector. |
| ajax-write-to  | HTML attribute name | Writes the data to a particular HTML attribute, rather than innerHTML or innerText. |
| ajax-listener  | Event name | Specifies the name of the custom event that will make this element repeat its request |
| ajax-event     | Event name |  Specifies the name of the custom event to dispatch when the triggered (default trigger event is the click event unless the element is a form: in which case the default event is teh submit event) |
| ajax-trigger   | JavaScript event name | 
| ajax-defer     | n/a | Tells the library to not make ajax-get request on page load |
| ajax-post      | URL | Exclusively for <form> tags. Tells HTML-AJAX where to post the form's data to |

<br>

## Ajax Events System
Want to trigger ajax-get or ajax-post requests, other than on page load or form submissions? The library ships with an inbuilt events system for handling this.

Using the *ajax-event*, *ajax-trigger* and *ajax-listener* attributes this is possible.

### ajax-event = "event-name"
This specifies the name of the ajax event to trigger. The default trigger for the event to be fired off is if this element is clicked (Unless the element is a ```<form>``` in which case the default event is fired after the form submission has finished).

When the event is triggered, any elements using *ajax-listener* will repeat their ajax-get or ajax-post requests.


### ajax-trigger = "js-event"

This attribute is used on the element that triggers the ajax event. any standard js event type is valid. The ajax-event will be triggered when the specified event is fired for the element.

The list of all event types: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing


#### For Example
If you wanted to fire the *ajax-event* called 'get-customer-data' when a an input's value changes:
```html

<input ajax-event="get-customer-data" ajax-trigger="input" >

```

### ajax-listener

Use this in an element who's ajax-get or ajax-post event you would like to be repeated whenever this event is fired.

#### Eg. refreshing customer data

```html

<div
    ajax-get="/customer-details"
    ajax-listener="get-customer-data"
    ajax-parser="parse_customer_data"
    ajax-parse-json
></div>


<button ajax-event="ajax-event-name">

```

<br>

## Examples

### 1. GET Requests

<hr>

<br>

**The most simple use case**
```html
<div
    ajax-get = "https://domain.com/my-resource"
>
</div>
```

<br>

**Using a parser function**
```html
<div
    ajax-get = "https://domain.com/my-resource"
    ajax-parser = "parser_function"
    ajax-parse-json
></div>
```

*The data fetched from ajax-get will be passed to the function specified by ajax-parser, what this function returns will be written to the element as HTML*

```js

function parser_function(response_data) {
    let html = ''
    for (let i = 0; i < response_data.length; i++) {
        html += `<p><b>${response_data[i].name}</b> - ${response_data[i].age}</p>`
    }
    return html  // This is what will be written as html to the element
}

```

*This is the parser function used to process the data, the response data will be passed to the parser function. In this case the response data will be parsed from JSON before being passed in, as specified by ajax-options*

<br>

**Using a parser function with a JSON response**
```html
<div
    ajax-get = "https://domain.com/my-resource"
    ajax-parser = "function_name"
    ajax-parse-json
>
</div>
```
*Same as the above, but the response data will be passed to ajax-parser after being parsed as JSON*

<br>

**Triggering a request with an event after page load**
```html
<div
    ajax-get = "https://domain.com/my-resource"
    ajax-listener = "listenerName"
>
</div>

<button
    ajax-event = "listenerName"
    ajax-trigger = "mouseover"
>
Refresh
</button>
```
*When the cursor hovers over the button, every element with ajax-listener set to the same string as ajax-event will repeat its AJAX request, refreshing its content.*

<br>

### 2. POST Requests

<hr>

<br>


**Handling a form submission**
```html
<form ajax-post = "/your-endpoint">
    <input type = "text" placeholder = "Full Name" name = "fullName">
    <input type = "submit">
</form>
```
*When the form submit event is fired, the data in the form will be encapsulated automatically in a form data object and then posted to the endpoint.*