import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const SemanticCard = () => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
        <Card.Header>Steve Sanders</Card.Header>
        <Card.Meta>Friends of Elliot</Card.Meta>
        <Card.Description>
          Steve wants to add you to the group <strong>best friends</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
)

export default SemanticCard
