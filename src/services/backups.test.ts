// Backups Service Unit Tests
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createMockClient = () => {
    const mock: any = {
        from: vi.fn(),
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        gte: vi.fn(),
        lte: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        single: vi.fn()
    }

    mock.from.mockReturnThis()
    mock.select.mockReturnThis()
    mock.insert.mockReturnThis()
    mock.update.mockReturnThis()
    mock.delete.mockReturnThis()
    mock.eq.mockReturnThis()
    mock.order.mockReturnThis()
    mock.limit.mockReturnThis()
    mock.single.mockReturnThis()

    mock.then = (resolve: any) => resolve({ data: [], error: null })

    return mock
}

const mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    getBackupHistory,
    getRecordHistory,
    restoreToVersion,
    getDeletedRecords,
    getBackupStats
} from './backups'

describe('Backups Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset default then behavior
        mockClient.then = (resolve: any) => resolve({ data: [], error: null })
    })

    describe('getBackupHistory', () => {
        it('fetches backup history with filters', async () => {
            const mockBackups = [{ id: '1', table_name: 'test_table' }]

            mockClient.then = (resolve: any) => resolve({ data: mockBackups, error: null })

            const result = await getBackupHistory({
                tableName: 'test_table',
                recordId: 'rec123',
                operation: 'UPDATE',
                limit: 10
            })

            expect(mockClient.from).toHaveBeenCalledWith('data_backups')
            expect(mockClient.eq).toHaveBeenCalledWith('table_name', 'test_table')
            expect(mockClient.eq).toHaveBeenCalledWith('record_id', 'rec123')
            expect(mockClient.eq).toHaveBeenCalledWith('operation', 'UPDATE')
            expect(mockClient.limit).toHaveBeenCalledWith(10)
            expect(result).toEqual(mockBackups)
        })
    })

    describe('getRecordHistory', () => {
        it('fetches history for specific record', async () => {
            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getRecordHistory('users', 'user1')

            expect(mockClient.eq).toHaveBeenCalledWith('table_name', 'users')
            expect(mockClient.eq).toHaveBeenCalledWith('record_id', 'user1')
        })
    })

    describe('restoreToVersion', () => {
        it('restores from UPDATE operation using old_data', async () => {
            const mockBackup = {
                id: 'backup1',
                operation: 'UPDATE',
                old_data: { id: 'rec1', name: 'Old Name', updated_at: '2023-01-01' },
                new_data: { id: 'rec1', name: 'New Name' }
            }

            let callCount = 0
            mockClient.then = (resolve: any) => {
                callCount++
                if (callCount === 1) {
                    return resolve({ data: mockBackup, error: null })
                }
                return resolve({ error: null })
            }

            const result = await restoreToVersion('users', 'rec1', 'backup1')

            expect(result).toBe(true)
            // Verify update called with correct data (excluding id/timestamps)
            expect(mockClient.update).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Old Name',
                deleted_at: null,
                deleted_by: null
            }))
        })

        it('restores from INSERT operation using new_data', async () => {
            const mockBackup = {
                id: 'backup2',
                operation: 'INSERT',
                old_data: null,
                new_data: { id: 'rec2', name: 'Inserted Name' }
            }

            let callCount = 0
            mockClient.then = (resolve: any) => {
                callCount++
                if (callCount === 1) {
                    return resolve({ data: mockBackup, error: null })
                }
                return resolve({ error: null })
            }

            const result = await restoreToVersion('users', 'rec2', 'backup2')

            expect(result).toBe(true)
            expect(mockClient.update).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Inserted Name'
            }))
        })

        it('throws error if backup not found', async () => {
            mockClient.then = (resolve: any) => resolve({ data: null, error: null })

            await expect(restoreToVersion('users', 'rec1', 'backup1'))
                .rejects.toThrow('Backup bulunamadı')
        })
    })

    describe('getDeletedRecords', () => {
        it('fetches deleted records', async () => {
            const mockData = [
                { record_id: '1', changed_at: '2023-01-01', old_data: { name: 'Deleted Item' } }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockData, error: null })

            const result = await getDeletedRecords('users')

            expect(mockClient.eq).toHaveBeenCalledWith('table_name', 'users')
            expect(mockClient.eq).toHaveBeenCalledWith('operation', 'DELETE')
            expect(result).toEqual([
                { id: '1', deleted_at: '2023-01-01', data: { name: 'Deleted Item' } }
            ])
        })
    })

    describe('getBackupStats', () => {
        it('calculates backup stats', async () => {
            const yesterday = new Date()
            yesterday.setHours(yesterday.getHours() - 1) // Within 24 hours

            const mockBackups = [
                { table_name: 'users', operation: 'UPDATE', changed_at: yesterday.toISOString() },
                { table_name: 'users', operation: 'DELETE', changed_at: '2022-01-01' },
                { table_name: 'posts', operation: 'INSERT', changed_at: '2022-01-01' }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockBackups, error: null })

            const stats = await getBackupStats()

            expect(stats.totalBackups).toBe(3)
            expect(stats.last24Hours).toBe(1)
            expect(stats.byTable).toEqual(expect.arrayContaining([
                { table_name: 'users', count: 2 },
                { table_name: 'posts', count: 1 }
            ])) // arrayContaining doesn't care about others
            expect(stats.byOperation).toEqual(expect.arrayContaining([
                { operation: 'UPDATE', count: 1 },
                { operation: 'DELETE', count: 1 },
                { operation: 'INSERT', count: 1 }
            ]))
        })
    })
})
