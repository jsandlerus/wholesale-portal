import * as React from 'react'
import Input from '@material-ui/core/Input';

import {
  CreateButton,
  ArrayField,
  List,
  Create,
  ReferenceField,
  Edit,
  SimpleForm,
  NumberField,
  TopToolbar,
  Button,
  Datagrid,
  TextField,
  TextInput,
  DateInput,
  ArrayInput,
  NumberInput,
  DateField,
  EditButton,
  Show,
  SimpleShowLayout,
  DeleteButton,
  AutocompleteInput,
  ListButton,
  RichTextField,
  ShowButton,
  DisabledInput,
  BooleanInput,
  LongTextInput,
  sanitizeListRestProps,
  ReferenceManyField,
  basePath,
  useListContext,
  Toolbar,
  SaveButton,
  Filter
} from 'react-admin'



export const OrderList = props => (
  <List
    filters={<OrderFilter />}
    {...props}
    actions={<ListActions />}
    sort={{ field: 'date', order: 'DESC' }}
    bulkActionButtons={false}
  >
    <Datagrid rowClick='show'>
      <TextField label='Order ID' source='id' />
      <ReferenceField
        label='User'
        link='show'
        source='user'
        reference='admin-users'
      >
        <TextField label='Name' source='name' />
      </ReferenceField>
      <NumberField
        label='Total'
        source='total'
        options={{ style: 'currency', currency: 'USD' }}
      />
      <NumberField
        label='# of Products'
        source='products.length'
        sortable={false}
      />
      <TextField label='Tracking Number' source='tracking.number' />
      <DateField label='Date' source='date' />
      <ShowButton />
    </Datagrid>
  </List>
)

const ListActions = props => {
  const { className, exporter, filters, maxResults, ...rest } = props
  const {
    basePath,
    resource,
    showFilter,
    displayedFilters,
    filterValues
  } = useListContext()
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        React.cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button'
        })}
      {/* <CreateButton basePath={basePath} /> */}
    </TopToolbar>
  )
}

const OrderFilter = props => {
  let state = ""

  function change(event) {
    state = event.target.value
  }

  function submit() {
    window.location.href = `/admin-orders/${state}/show`
  }

  return (
    <Filter {...props}>
      <form onSubmit={submit} alwaysOn>
        <Input type="text" onChange={change} alwaysOn placeholder="Search By Order ID"/>
      </form>
      {/* <TextInput label="Search by Tracking #" source="tracking.number" alwaysOn /> */}
    </Filter>
  )
}

export const OrderShow = props => (
  <Show actions={<OrderShowActions />} {...props}>
    <SimpleShowLayout>
      {/* <TextField label="User" source="user" reference="admin-users"/> */}
      <ReferenceField label='User' source='user' reference='admin-users'>
        <TextField label='Name' source='name' />
      </ReferenceField>
      <ReferenceField label='Email' source='user' reference='admin-users'>
        <TextField label='Email' source='email' />
      </ReferenceField>
      <TextField label='Order ID' source='id' />
      <ArrayField label='Products Ordered' source='products'>
        <Datagrid rowClick='show'>
          <ReferenceField
            label='Product'
            source='productId'
            reference='admin-products'
          >
            <TextField label='Product' source='name' />
          </ReferenceField>
          <NumberField label='Quantity' source='productQuantity' />
          <NumberField
            label='Price Per Unit'
            options={{ style: 'currency', currency: 'USD' }}
            source='productPrice'
          />
          <NumberField
            label='Final Price'
            options={{ style: 'currency', currency: 'USD' }}
            source='productTotal'
          />
        </Datagrid>
      </ArrayField>
      <NumberField
        label='Order Total'
        source='total'
        options={{ style: 'currency', currency: 'USD' }}
      />
      <h2>Tracking Information</h2>
      <TextField label='Shipping Company' source='tracking.company' />
      <TextField label='Tracking Number' source='tracking.number' />
    </SimpleShowLayout>
  </Show>
)

const shippingCategories = [
  { id: 'USPS', name: 'USPS' },
  { id: 'UPS', name: 'UPS' },
  { id: 'Fedex', name: 'Fedex' }
]

export const OrderEdit = props => (
  <Edit undoable={false} actions={<OrderEditActions />} {...props}>
    <SimpleForm toolbar={<OrderEditToolbar />}>
      <h2>User Information</h2>
      <ReferenceField label='User Email' source='user' reference='admin-users'>
        <TextField source='email' />
      </ReferenceField>
      <ReferenceField label='User Name' source='user' reference='admin-users'>
        <TextField source='name' />
      </ReferenceField>
      <TextInput disabled label='Order ID' source='id' />

      <NumberField
        label='Order Total'
        disabled
        source='total'
        options={{ style: 'currency', currency: 'USD' }}
      />
      <div className='order_show_tracking'>
        <h2>Tracking Information</h2>
        <AutocompleteInput
          label='Shipping Company'
          source='tracking.company'
          choices={shippingCategories}
        />
        <TextInput label='Tracking Number' source='tracking.number' />
      </div>
    </SimpleForm>
  </Edit>
)

//custom comps
const OrderShowActions = ({ permissions, basePath, data, resource }) => (
  <TopToolbar>
    <EditButton basePath={basePath} record={data} />
    {permissions === 'owner' && (
      <DeleteButton basePath={basePath} record={data} />
    )}
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)

const OrderEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)

const OrderEditToolbar = props => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
)
