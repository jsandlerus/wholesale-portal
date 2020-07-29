import * as React from 'react'
import { OrderList } from './Orders'
import {
  List,
  Create,
  Edit,
  SimpleForm,
  ArrayField,
  DisabledInput,
  BooleanInput,
  TextInput,
  DateInput,
  ReferenceField,
  ReferenceManyField,
  LongTextInput,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  Show,
  SimpleShowLayout,
  RichTextField,
  ShowButton,
  TopToolbar,
  Button,
  DeleteButton,
  ListButton,
  CreateButton,
  useQuery,
  Loading,
  Error,
  SingleFieldList,
  ChipField,
  ArrayInput,
  SimpleFormIterator,
  NumberInput
} from 'react-admin'

export const UserShow = props => {
  console.log('usershow', props)
  return (
    <Show actions={<UserShowActions />} {...props}>
      <SimpleShowLayout>
        <TextField label='Full Name' source='name' />
        <TextField label='Payment confirmed' source='paymentVerified' />
        <TextField label='DocuSign confirmed' source='docusignVerified' />
        <ArrayField label='Favorites' source='favorites'>
          <Datagrid>
            <TextField label='ID' source='id' />
            <TextField label='Product Name' source='name' />
            <TextField label='Category' source='category' />
            <TextField label='Price' source='price' />
          </Datagrid>
        </ArrayField>
        <ReferenceManyField
          label='Order History'
          source='id'
          reference='admin-orders'
          target='user'
        >
          <Datagrid>
            <TextField label='Total' source='total' />
            <TextField label='Date' source='date' />
            <TextField label='Product Purchased' source='products.length' />
          </Datagrid>
        </ReferenceManyField>
        <TextField label='Database ID' source='id' />
        <TextField label='Google ID' source='googleID' />
        <TextField label='goCardless ID' source='goCardlessID' />
        {/* <Button color="primary">See Order History</Button> */}
      </SimpleShowLayout>
    </Show>
  )
}

export const UserList = props => (
  <List {...props}>
    <Datagrid rowClick='show'>
      <TextField label='Name' source='name' />
      <TextField label='Database ID' source='id' />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const UserEdit = props => (
  <Edit
    undoable={false}
    title={<UserTitle />}
    actions={<UserEditActions />}
    {...props}
  >
    <SimpleForm>
      <TextInput disabled label='ID' source='id' />
      <TextInput label='name' source='name' />
      <BooleanInput
        disabled
        label='Payment Verified'
        source='paymentVerified'
      />
      <BooleanInput
        label='Enable Purchases (form signed)'
        source='docusignVerified'
      />
      <TextInput disabled label='goCardless ID' source='goCardlessID' />
      <ArrayInput label='Cart' source='cart'>
        <SimpleFormIterator>
          <TextInput disabled label='Product' source='product' />
          <NumberInput label='Quantity' source='quantity' />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
)

// custom components

const UserTitle = ({ record }) => {
  return <span>Post {record ? `"${record.name}"` : ''}</span>
}

const UserShowActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <EditButton basePath={basePath} record={data} />
    <DeleteButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)
const UserEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <DeleteButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
    {/* Add your custom actions */}
  </TopToolbar>
)