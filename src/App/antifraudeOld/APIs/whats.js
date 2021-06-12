import axios from 'axios';

const whatsRequest = razao => recipient => {
  const url = process.env.WHATS_URL;
  const method = 'POST';
  const headers = {
    Authorization: process.env.WHATS_TOKEN,
    'Content-Type': 'application/json',
  };
  const data = {
    recipient,
    template_name: 'antifraud-trouble',
    template_parameters: { razao },
  };
  axios({ url, method, headers, data }).catch(error => console.log('cannot send whats', { razao, recipient, error }));
};

const recipients = ['15306017334', '971558399235', '5511962237883'];

export const sendWhats = ({ razao }) => recipients.map(whatsRequest(razao));
