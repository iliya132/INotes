import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PrettyMarkup from '../../components/PrettyMarkup';
import configureMarkdownIt from '../../Misc/utils/configureMarkdown';
import properties from '../../properties/properties';
import NotFound from '../NotFound';
import styles from './Shared.scss';

const baseUrl = properties.apiUrl;
const notebookurl = baseUrl + 'api/notebook/';

export function Shared() {
    const { sharedUrl } = useParams();
    const [content, setContent] = useState('');
    const [isLoaded, setLoaded] = useState(false);
    const loadData = async () => {
        const res = await axios.get(`${notebookurl}shared-note/${sharedUrl}`);
        const md = configureMarkdownIt();
        setContent(md.render(res.data));
        setLoaded(true);
    };

    useEffect(() => {
        loadData().catch(() => {
            setLoaded(true);
        });
        return () => {};
    }, []);

    return !isLoaded ? (
        <div>loading...</div>
    ) : content ? (
        <PrettyMarkup renderedValue={content} className={styles['render-mode']} />
    ) : (
        <NotFound />
    );
}
