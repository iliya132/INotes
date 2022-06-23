import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/Page/page';
import PrettyMarkup from '../../components/PrettyMarkup';
import configureMarkdownIt from '../../Misc/utils/configureMarkdown';
import properties from '../../properties/properties';
import styles from './Shared.scss';

const baseUrl = properties.apiUrl;
const notebookurl = baseUrl + 'api/notebook/';

export function Shared() {
    const { sharedUrl } = useParams();
    const [content, setContent] = useState('');
    const loadData = async () => {
        const res = await axios.get(`${notebookurl}shared-note/${sharedUrl}`);
        const md = configureMarkdownIt();
        setContent(md.render(res.data));
    };

    useEffect(() => {
        loadData();
        return () => {};
    }, []);

    return (
        <Page>
            <PrettyMarkup renderedValue={content} className={styles['render-mode']} />
        </Page>
    );
}
