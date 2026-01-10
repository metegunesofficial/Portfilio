// Settings Service Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const createMockClient = () => {
    const mock: any = {
        from: vi.fn(),
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        is: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        single: vi.fn(),
        channel: vi.fn()
    }

    mock.from.mockReturnValue(mock)
    mock.select.mockReturnValue(mock)
    mock.insert.mockReturnValue(mock)
    mock.update.mockReturnValue(mock)
    mock.delete.mockReturnValue(mock)
    mock.eq.mockReturnValue(mock)
    mock.is.mockReturnValue(mock)
    mock.order.mockReturnValue(mock)
    mock.limit.mockReturnValue(mock)
    mock.single.mockReturnValue(mock)
    mock.channel.mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })

    mock.then = (resolve: any) => resolve({ data: [], error: null })

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    getSettings,
    getSettingByKey,
    getSettingsMap,
    createSetting,
    updateSettingByKey,
    updateSetting,
    updateMultipleSettings,
    deleteSetting,
    subscribeToSettingsChanges
} from './settings'

describe('Settings Service', () => {
    beforeEach(() => {
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getSettings', () => {
        it('fetches all settings', async () => {
            const mockSettings = [{ key: 'site_title', value_tr: 'Başlık' }]
            mockClient.then = (resolve: any) => resolve({ data: mockSettings, error: null })

            const result = await getSettings()

            expect(mockClient.from).toHaveBeenCalledWith('settings')
            expect(mockClient.is).toHaveBeenCalledWith('deleted_at', null)
            expect(result).toEqual(mockSettings)
        })
    })

    describe('getSettingByKey', () => {
        it('fetches setting by key', async () => {
            const mockSetting = { key: 'site_title', value_tr: 'Başlık' }
            mockClient.then = (resolve: any) => resolve({ data: mockSetting, error: null })

            const result = await getSettingByKey('site_title')

            expect(mockClient.eq).toHaveBeenCalledWith('key', 'site_title')
            expect(result).toEqual(mockSetting)
        })

        it('returns null if not found', async () => {
            mockClient.then = (resolve: any) => resolve({ data: null, error: null })

            const result = await getSettingByKey('nonexistent')

            expect(result).toBeNull()
        })
    })

    describe('getSettingsMap', () => {
        it('returns tr map correctly', async () => {
            const mockSettings = [
                { key: 'title', value_tr: 'Başlık', value_en: 'Title', type: 'text' },
                { key: 'config', value_tr: '{"enabled": true}', value_en: '{"enabled": true}', type: 'json' }
            ]
            mockClient.then = (resolve: any) => resolve({ data: mockSettings, error: null })

            const map = await getSettingsMap('tr')

            expect(map['title']).toBe('Başlık')
            expect(map['config']).toEqual({ enabled: true })
        })

        it('returns en map correctly', async () => {
            const mockSettings = [
                { key: 'title', value_tr: 'Başlık', value_en: 'Title', type: 'text' }
            ]
            mockClient.then = (resolve: any) => resolve({ data: mockSettings, error: null })

            const map = await getSettingsMap('en')

            expect(map['title']).toBe('Title')
        })

        it('handles invalid json gracefully', async () => {
            const mockSettings = [
                { key: 'bad_json', value_tr: '{invalid', type: 'json' }
            ]
            mockClient.then = (resolve: any) => resolve({ data: mockSettings, error: null })

            const map = await getSettingsMap('tr')

            expect(map['bad_json']).toBe('{invalid')
        })
    })

    describe('CRUD operations', () => {
        it('creates setting', async () => {
            const newSetting = { key: 'new', value_tr: 'val' }
            mockClient.then = (resolve: any) => resolve({ data: newSetting, error: null })

            const result = await createSetting(newSetting)

            expect(mockClient.insert).toHaveBeenCalled()
            expect(result).toEqual(newSetting)
        })

        it('updates setting by key', async () => {
            const update = { value_tr: 'new val' }
            mockClient.then = (resolve: any) => resolve({ data: { ...update, key: 'key' }, error: null })

            await updateSettingByKey('key', update)

            expect(mockClient.update).toHaveBeenCalled()
            expect(mockClient.eq).toHaveBeenCalledWith('key', 'key')
        })

        it('updates setting by id', async () => {
            const update = { value_tr: 'new val' }
            mockClient.then = (resolve: any) => resolve({ data: { ...update, id: '123' }, error: null })

            await updateSetting('123', update)

            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
        })

        it('soft deletes setting', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            await deleteSetting('key')

            expect(mockClient.update).toHaveBeenCalledWith(expect.objectContaining({ deleted_at: expect.any(String) }))
            expect(mockClient.eq).toHaveBeenCalledWith('key', 'key')
        })
    })

    describe('updateMultipleSettings', () => {
        it('updates multiple settings', async () => {
            const settingsToUpdate = [
                { key: 's1', value_tr: 'v1' },
                { key: 's2', value_tr: 'v2' }
            ]

            // Should resolve successfully for each iteration
            mockClient.then = (resolve: any) => resolve({ error: null })

            await updateMultipleSettings(settingsToUpdate)

            expect(mockClient.update).toHaveBeenCalledTimes(2)
            expect(mockClient.eq).toHaveBeenCalledWith('key', 's1')
            expect(mockClient.eq).toHaveBeenCalledWith('key', 's2')
        })
    })

    describe('subscribeToSettingsChanges', () => {
        it('subscribes to changes', () => {
            const callback = vi.fn()
            subscribeToSettingsChanges(callback)
            expect(mockClient.channel).toHaveBeenCalledWith('settings_changes')
        })
    })
})
