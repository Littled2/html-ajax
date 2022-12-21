# AJAX in HTML

A tiny library used to let your HTML fetch data **after** the page has loaded.

This can be used to fill the page with data as soon as the page loads or a request can be triggered via an event.

## Documentation


|  Attribute Name  |  Purpose  |
|------------------|-----------|
| ajax-get         | Used to tell the library where to fetch the data from |
| ajax-parser      | Used to specify a function that the data should be passed to |
| ajax-listener    | Specifies the name of the html-ajax event that will make this element repeat its request |
| ajax-update      | Specifies the name of the html-ajax event to dispatch when the triggered (default trigger event is the click event) |
| ajax-trigger     | Used to specify the event that should trigger the ajax event |
| ajax-defer        | Tells the library to fetch the data on page load (default = True) |
| ajax-options      | Used to pass any other options about this ajax request eg. parse as JSON |


<br>

## Examples

<br>

**The most simple use case**
```
<div
    ajax-get = "https://domain.com/my-resource"
>
</div>
```

<br>

**Using a parser function**
```
<div
    ajax-get = "https://domain.com/my-resource"
    ajax-parser = "function_name"
>
</div>
```
*The data fetched from ajax-get will be passed to the function specified by ajax-parser, what this function returns will be written to the element as HTML*

<br>

**Using a parser function with a JSON response**
```
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
```
<div
    ajax-get = "https://domain.com/my-resource"
    ajax-listener = "listenerName"
>
</div>

<button
    ajax-update = "listenerName"
>
Refresh
</button>
```
*When the button is clicked, every element with ajax-listener set to the same string as ajax-event will repeat its AJAX request, refreshing its content.*