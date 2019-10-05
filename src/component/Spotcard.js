import React from 'react';

import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

import './spotcard.css';

const Spotcard = () => (
    <Div>
        <div className={'spotcard-container'}>
            <div className={'spotcard-cover'}>
                <div className={'spotcard-cover-dark'}></div>
                <div className={'spotcard-title'}>Рядом с Вами</div>
            </div>
            <div className='spotcard-inforow'>
                <Cell 
                    before={<Avatar src={"https://image-ticketfly.imgix.net/00/03/20/63/52-og.jpg?w=300&h=300"} size={42} />}
                    asideContent={<Button>Засветиться</Button>}>
                    <p className={'spotcard-info-title'}>Tessa Violet</p>
                    <p className={'spotcard-info-title description'}>I like (the idea of) You</p>
                </Cell>
            </div>    
        </div>
    </Div>
);

export default Spotcard;