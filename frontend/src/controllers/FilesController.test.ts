import axios from 'axios';
import { jest } from '@jest/globals';
import filesController from './FilesController';

import { store } from '../store/store';
import { setState } from "../store/reducers/notebooksReducer";


jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(setState([]));
})

describe('uploading file', () => {
    it('can upload file', async () => {
        mockAxiosPostResult({ 'filename': 'linkToFile' })
        const blob: BlobPart[] = [new ArrayBuffer(10)]
        const file = new File(blob, 'test-filename')
        await filesController.uploadfile([file], 0)
    })
})

function mockAxiosPostResult(result: any) {
    (axios.post as jest.Mock).mockResolvedValue(result);
}
