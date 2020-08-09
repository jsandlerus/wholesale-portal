import * as React from 'react'
import { cloneElement, useMemo } from 'react'

import {
  useNotify,
  useRefresh,
  useRedirect,
  List,
  Create,
  ArrayField,
  FunctionField,
  Edit,
  SimpleForm,
  NumberInput,
  DisabledInput,
  BooleanInput,
  BooleanField,
  ImageInput,
  TextInput,
  DateInput,
  ArrayInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  SimpleFormIterator,
  DateField,
  EditButton,
  Show,
  SimpleShowLayout,
  RichTextField,
  ShowButton,
  TopToolbar,
  Button,
  ImageField,
  DeleteButton,
  ListButton,
  CreateButton,
  ExportButton,
  useListContext,
  sanitizeListRestProps,
  AutocompleteInput,
  NumberField
} from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'

export const CustomList = props => (
    <List {...props}>
      <Datagrid actions={<ListActions />} rowClick='show'>
        <DeleteButton />
      </Datagrid>
    </List>
)

//custom comps
const ListActions = props => {
    const { className, exporter, filters, maxResults, ...rest } = props
    const {
      resource,
      displayedFilters,
      filterValues,
      basePath,
      showFilter
    } = useListContext()
    return (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button'
          })}
        <DeleteButton basePath={basePath} />
        <CreateButton basePath={basePath} />
        {/* <ExportButton
          disabled={total === 0}
          resource={resource}
          sort={currentSort}
          filterValues={filterValues}
          maxResults={maxResults}
        /> */}
        {/* Add your custom actions */}
      </TopToolbar>
    )
}
  
