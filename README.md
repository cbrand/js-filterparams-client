# Filterparams Client #

This is a library, which provides an object oriented approach
to define queries and output them into a [filterparams](https://github.com/cbrand/go-filterparams)
compatible format.

## Installation ##

The package is available on [npm](https://www.npmjs.com/package/filterparams/). 
Simply install it through npm into your project.

```
npm install --save-dev filterparams
```

At the moment the project is not available on bower, due to the necessity
in bower to keep compiled data in the repository. You're welcome to host
it yourself. I refuse to keep any compiled data in the main git repository. 

## Usage ##

At the moment the package provided is using node modules. The package
provides a public api when directly importing it.

```javascript
var params = require('filterparams');

var query = params.query();
var filters = params.filters({
    equals: 'eq',
    greater: 'gt',
    lesser: 'lt',
    like: 'like'
});

query = (
    query.filter(
        params.or(filters('firstName').equals('joe'), 
                  filters('lastName').like('%doe%')))
    .filter(filters('age').greater(25))
    .order('lastName', true)
    .order('firstName')
);

console.log(query.generateParams());
```

This would generate:

```javascript
{ 'filter[binding]': '(firstName|lastName)&age',
  'filter[param][firstName][eq]': 'joe',
  'filter[param][lastName][like]': '%doe%',
  'filter[param][age][gt]': 25,
  'filter[order]': [ 'desc(lastName)', 'asc(firstName)' ] }
```

You can then pass this data into the AJAX request of your choice to request
the data from your backend.

### API ###

The external API provides the following functions:

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>#query()</td>
            <td>Creates a new empty query object, which stores configuration data.</td>
        </tr>
        <tr>
            <td>#filters(object)</td>
            <td>Generates depending from the passed object filter functions, which can be invoked to
            generate filter parameters.</td>
        </tr>
        <tr>
            <td>#and(...data)</td>
            <td>Combines several parameters through an and expression.</td>
        </tr>
        <tr>
            <td>#or(...data)</td>
            <td>Combines several parameters through an or expression.</td>
        </tr>
        <tr>
            <td>#not(param)</td>
            <td>Negates a parameter, an and expression or an OR expresion.</td>
        </tr>
        <tr>
            <td>#param(name, filter, value)</td>
            <td>Creates and parameter with the provided parameter name, the filter and the value.
            Usually the usage of this function is not recommened. Instead use the `#filters()` functionality
            to create custom functions for creating these parameters.</td>
        </tr>
    </tbody>
</table>

### Filters ###

The `#filters` function is a convenience method to create parameters for specific filters, which are
easier readable than specifying the parameters through the `#params` function.

You must know which filters are supported by the backend and their filter code. Then you can create a
configuration object with the names of the created functions as keys and the filter code as values.

```javascript
var filters = require('filterparams').filters({
    'equals': 'eq',
    'like': 'like'
});

console.log(filters('name').like('%brand%'));
# >>> Parameter { name: 'name', filter: 'like', alias: null, value: '%brand%' }

console.log(filters.equals('name', 'brand'));
# >>> Parameter { name: 'name', filter: 'eq', alias: null, value: 'brand' }
```

These are equivalent to:

```javascript
console.log(require('filterparams').param('name', 'eq', 'brand'));
```

### Query ###

The `Query` class is designed to not change their state. This means that every
changing method in the query is creating and returning a new query object.

Thus existing queries can be kept for preconfiguration purposes.

The query class has the following functions:
- `#filter(filterObj)` - Applies a filter to the query. If there are already filters present
    in the configuration the passed filter is combined with the existing ones through
    an `AND` combination.
- `#order(orderName, isDesc)` - Applies an order configuration to the query. It can be called
    multiple times and is then concatenated. So `query.order('firstName', true).order('lastName')`
    would generate query which result is first ordered by firstName in descending order and
    afterwards by lastName in ascending order.
- `#generateParams()` - Generates the object which has to be passed to the AJAX request and
    serializes the configuration of the query into the filterparams format.


### Combinations ###

Combinations of parameters can be arbitrarily nested. If you for example would like to
express the following SQL Statement:

```sql
SELECT * FROM users WHERE (firstName = 'john' and lastName = 'doe' and age > 25) or lastName != 'ryan'
```

you can do so with the following javascript code:

```
var params = require('filterparams');

var query = params.query();
var filters = params.filters({
    equals: 'eq',
    greater: 'gt'
});

query = (
    query.filter(
        params.or(
            params.and(filters('firstName').equals('john'), 
                       filters('lastName').equals('doe'),
                       filters('age').greater(25)),
            params.not(filters('lastName').equals('ryan')))
);

console.log(query.generateParams());
```

## License ##

The project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Server Side Bindings ##

At the moment the following parsers exist for parsing the filterparams definition
in a server side application.

- Go - [go-filterparams](https://github.com/cbrand/go-filterparams)
- Python - [filterparams](https://github.com/cbrand/python-filterparams)
