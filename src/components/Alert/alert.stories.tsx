import React from 'react'
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import Alert from './alert';

const defaultAlert = () => (
    <Alert title="default alert" onClose={action('close alert')}/>
);

const typeAlert = () => (
    <>
        <Alert title="default alert" />
        <Alert type="success" title="success alert" />
        <Alert type="danger" title="danger alert" />
        <Alert type="warning" title="warning alert" />
    </>
);

const hasCloseAlert = () => (
    <>
        <Alert title="can close alert" onClose={action('close alert')}/>
        <Alert title="can't close alert" hasClose={false} />
    </>
);

storiesOf('Alert Component', module)
    .add('Alert', defaultAlert)
    .add('不同类型的Alert', typeAlert)
    .add('能否关闭的Alert', hasCloseAlert)