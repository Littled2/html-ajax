# AJAX in HTML

A tiny library used to let your HTML fetch data **after** the page has loaded.

This can be used to fill the page with data as soon as the page loads or a request can be triggered via an event.

## Documentation

### For Getting Data

<br>


|  Attribute Name  |  Purpose  |
|------------------|-----------|
| ajax-get         | Used to tell the library where to fetch the data from |
| ajax-parser      | Used to specify a function that the data should be passed to |
| ajax-listener    | Specifies the name of the html-ajax event that will make this element repeat its request |
| ajax-update      | Specifies the name of the html-ajax event to dispatch when the triggered (default trigger event is the click event unless the element is a form: in which case the default event is teh submit event) |
| ajax-trigger     | Used to specify the event that should trigger the ajax event |
| ajax-defer        | Tells the library not to fetch the data on page load |
| ajax-options      | Used to pass any other options about this ajax request eg. Parse as JSON (json: true) |

### For Posting Data

<br>

|  Attribute Name  |  Purpose  |
|------------------|-----------|
| ajax-post        | Specifies the endpoint to post the data too |
| ajax-data        | Specifies the key of this data in the post request. The data value is the value attribute of the element where ajax-data is stated |
| ajax-options      | Used to pass any other options about this ajax request eg. Don't overwrite form with the server's response (overwrite: false) |

<br>

## Examples

### GET Requests

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
    ajax-options = "json:true"
>
</div>
```

*The data fetched from ajax-get will be passed to the function specified by ajax-parser, what this function returns will be written to the element as HTML*

```js

function parser_function(response_data) {
    let html = ''
    for (let i = 0; i < response_data.length; i++) {
        html += `<p><b>${response_data[i].name}</b>  ${response_data[i].name}</p>`
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

    ajax-options = "json:true"
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
    ajax-update = "listenerName"
    ajax-trigger = "mouseover"
>
Refresh
</button>
```
*When the cursor hovers over the button, every element with ajax-listener set to the same string as ajax-update will repeat its AJAX request, refreshing its content.*

<br>

### POST Requests

<hr>

<br>


**Handling a form submission**
```html
<form ajax-post = "/your-endpoint">
    <input placeholder = "Full Name" ajax-data = "fullName">
    <input type = "submit">
</form>
```
*When the form submit event is fired, the data in the form will be encapsulated automatically in a form data object and then posted to the endpoint. By default, the response from the server will overwrite innerHTML of the form.*

*The form data in this case will take the form:*
```js
{
    fullName: "The value entered"
}
```