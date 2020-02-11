import React, { Component } from 'react'
import {
	Table,
	Tag,
	Button,
	Icon
} from 'antd'
import Layout from '../../layout'

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		render: (text) => <h4>{text}</h4>,
	},
	{
		title: 'Age',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: 'Tags',
		key: 'tags',
		dataIndex: 'tags',
		render: (tags) => (
			<span>
				{tags.map((tag) => {
					let color = tag.length > 5 ? 'geekblue' : 'green'
					if (tag === 'no') {
						color = 'volcano'
					}
					return (
						<Tag color={color} key={tag}>
							{tag.toUpperCase()}
						</Tag>
					)
				})}
			</span>
		),
	},
	{
		key: 'actions',
		render: () => (
			<span>
				<Button size="small">
					<Icon type="delete" />
				</Button>
			</span>
		),
	},
]

let data = [
	{
		key: '1',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer'],
	},
	{
		key: '2',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		tags: ['no'],
	},
	{
		key: '3',
		name: 'Joe Black',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
		tags: ['cool', 'teacher'],
	},
]

data = [...data]
// data = [...data, ...data, ...data, ...data, ...data, ...data, ...data]

class Home extends Component {
	render() {
		return (
			<Layout>
				<Table
					columns={columns}
					dataSource={data}
					pagination={false}
					// scroll={{ y: '100vh' }}
					scroll={{ y: 'max-content' }}
				/>
			</Layout>
		)
	}
}

export default Home
