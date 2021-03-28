# Front-hands Action
This action retrieves an example of data being from Mendix Data Hub

## Inputs

### `country`
**Required** The country being targeted. By default, it takes The Netherlands

### `amount`
**Required** THe amount of employees to be retrieved. By default, it retrieves 3

## Outputs

### `employees`
An array containing employees.

## Example of usage
```yaml
uses: diego-antonelli/fronthands-action@v1
with:
  country: 'Netherlands'
  amount: '3'
```
