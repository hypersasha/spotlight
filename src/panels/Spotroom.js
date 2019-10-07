import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';


import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osName = platform();

const Spotroom = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader left={<HeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</HeaderButton>}>
                Spotlight
            </PanelHeader>
            <Group>
                <Cell 
                    description={'I Like (the idea of) You'}
                    before={<Avatar size={72} src={'https://image-ticketfly.imgix.net/00/03/20/63/52-og.jpg?w=300&h=300'} />}>
                    Tessa Violet
                </Cell>
            </Group>
        </Panel>
    )
}

Spotroom.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Spotroom;