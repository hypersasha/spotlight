import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import Spotroom from './panels/Spotroom';
import { ConfigProvider } from '@vkontakte/vkui';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [startParams, setStartParams] = useState({});
	const [history, setHistory]  = useState(['home']);
	//const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = 'client_dark';
				// data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			setUser(user);
		}
		fetchData();

		// Try to get app start params.
		receiveStartParams();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
		let currentHistory = history;
		currentHistory.push(e.currentTarget.dataset.to);

		if (activePanel === 'home') {
			connect.send('VKWebAppEnableSwipeBack');
		} 

		setHistory(currentHistory);
	};

	const goId = panelId => {
		setActivePanel(panelId);
		let currentHistory = history;
		currentHistory.push(panelId);

		if (activePanel === 'home') {
			connect.send('VKWebAppEnableSwipeBack');
		} 

		setHistory(currentHistory);
	}

	const goBack = () => {
		let history_tmp = history;
		history_tmp.pop();
		const prevPanel = history_tmp[history_tmp.length - 1];
		if (prevPanel === 'home') {
			connect.send('VKWebAppDisableSwipeBack')
		}
		setHistory(history_tmp);
		setActivePanel(prevPanel);
	}

	function receiveStartParams() {
		let hash = window.location.hash.substring(1);
		let hash_array = hash.split('&');
		let start_vars = {};
		hash_array.forEach(hashItem => {
			let hashInfo = hashItem.split('=');
			start_vars[hashInfo[0]] = hashInfo[1];
		})
		setStartParams(start_vars);

		if (start_vars.room && start_vars.room !== '') {
			goId('spotroom');
		}
	}

	return (
		<ConfigProvider isWebView={true}>
		<View activePanel={activePanel} history={history} onSwipeBack={goBack}>
			<Home id='home' fetchedUser={fetchedUser} go={go} />
			<Persik id='persik' go={go} />
			<Spotroom id='spotroom' go={goBack} startParams={startParams} />
		</View>
		</ConfigProvider>
	);
}

export default App;

