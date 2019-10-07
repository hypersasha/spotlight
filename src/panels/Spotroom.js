import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Div from '@vkontakte/vkui/dist/components/Div/Div';


import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import connect from '@vkontakte/vk-connect';

const osName = platform();

const Spotroom = (props) => {

    const [flashInfo, setFlashInfo] = useState(null);

    useEffect(() => {
        async function fetchFlashlightInfo() {
            const info = await connect.sendPromise('VKWebAppFlashGetInfo');
            setFlashInfo(info);
        }

        fetchFlashlightInfo();
    }, []);

    return (
        <Panel id={props.id}>
            <PanelHeader left={<HeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</HeaderButton>}>
                Засветиться
            </PanelHeader>
            <Group>
                <Cell 
                    description={'I Like (the idea of) You'}
                    before={<Avatar size={72} src={'https://image-ticketfly.imgix.net/00/03/20/63/52-og.jpg?w=300&h=300'} />}>
                    Tessa Violet
                </Cell>
            </Group>
            {(!flashInfo || flashInfo.is_available === false) &&
                <Div>
                    <FormStatus title='Фонарик не доступен' state='error'>
                        Не удалось получить доступ к фонарику на Вашем устройстве.
                    </FormStatus>
                </Div>
            }
            <Group title={'Информация о комнате'}>
                <List>
                    <Cell>
                        <InfoRow title='Участники'>65 человек</InfoRow>
                    </Cell>
                    <Cell>
                        <InfoRow title='Анимация света'>Яркие вспышки</InfoRow>
                    </Cell>
                </List>
            </Group>
        </Panel>
    )
}

Spotroom.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Spotroom;