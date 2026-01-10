// Projects Service Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create a proper chainable mock that returns itself for all query methods
const createMockClient = () => {
    const mockData: any = { data: [], error: null }

    const mock: any = {
        from: vi.fn(),
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        is: vi.fn(),
        or: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        single: vi.fn(),
        channel: vi.fn()
    }

    // Make each method return mock for chaining
    mock.from.mockReturnValue(mock)
    mock.select.mockReturnValue(mock)
    mock.insert.mockReturnValue(mock)
    mock.update.mockReturnValue(mock)
    mock.delete.mockReturnValue(mock)
    mock.eq.mockReturnValue(mock)
    mock.is.mockReturnValue(mock)
    mock.or.mockReturnValue(mock)
    mock.order.mockReturnValue(mock)
    mock.limit.mockReturnValue(mock)
    mock.single.mockReturnValue(mock)
    mock.channel.mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })

    // Override with promise resolution
    mock.then = (resolve: any) => resolve(mockData)

    return mock
}

let mockClient = createMockClient()

vi.mock('../lib/supabase-client', () => ({
    getSupabaseClient: () => mockClient
}))

import {
    getProjects,
    getProjectBySlug,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    restoreProject,
    toggleProjectPublish,
    toggleProjectFeatured,
    subscribeToProjectsChanges
} from './projects'

describe('Projects Service', () => {
    beforeEach(() => {
        mockClient = createMockClient()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getProjects', () => {
        it('fetches all projects', async () => {
            const mockProjects = [
                { id: '1', title_tr: 'Proje 1', published: true },
                { id: '2', title_tr: 'Proje 2', published: true }
            ]

            mockClient.then = (resolve: any) => resolve({ data: mockProjects, error: null })

            const result = await getProjects({ includeDeleted: true })

            expect(mockClient.from).toHaveBeenCalledWith('projects')
            expect(result).toEqual(mockProjects)
        })

        it('filters by published', async () => {
            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getProjects({ publishedOnly: true, includeDeleted: true })

            expect(mockClient.eq).toHaveBeenCalledWith('published', true)
        })

        it('filters by featured', async () => {
            mockClient.then = (resolve: any) => resolve({ data: [], error: null })

            await getProjects({ featuredOnly: true, includeDeleted: true })

            expect(mockClient.eq).toHaveBeenCalledWith('featured', true)
        })
    })

    describe('getProjectBySlug', () => {
        it('fetches project by slug', async () => {
            const mockProject = { id: '1', title_tr: 'Test', slug: 'test-project' }

            mockClient.then = (resolve: any) => resolve({ data: mockProject, error: null })

            const result = await getProjectBySlug('test-project')

            expect(mockClient.eq).toHaveBeenCalledWith('slug', 'test-project')
            expect(result).toEqual(mockProject)
        })

        it('returns null for non-existent slug', async () => {
            mockClient.then = (resolve: any) => resolve({ data: null, error: null })

            const result = await getProjectBySlug('non-existent')

            expect(result).toBeNull()
        })
    })

    describe('getProjectById', () => {
        it('fetches project by id', async () => {
            const mockProject = { id: '123', title_tr: 'Test Project' }

            mockClient.then = (resolve: any) => resolve({ data: mockProject, error: null })

            const result = await getProjectById('123')

            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(mockProject)
        })
    })

    describe('createProject', () => {
        it('creates a new project', async () => {
            const newProject = {
                title_tr: 'Yeni Proje',
                title_en: 'New Project',
                slug: 'new-project'
            }
            const createdProject = { id: '123', ...newProject }

            mockClient.then = (resolve: any) => resolve({ data: createdProject, error: null })

            const result = await createProject(newProject as any)

            expect(mockClient.insert).toHaveBeenCalled()
            expect(result).toEqual(createdProject)
        })
    })

    describe('updateProject', () => {
        it('updates an existing project', async () => {
            const updates = { title_tr: 'Updated Title' }
            const updatedProject = { id: '123', ...updates }

            mockClient.then = (resolve: any) => resolve({ data: updatedProject, error: null })

            const result = await updateProject('123', updates)

            expect(mockClient.update).toHaveBeenCalled()
            expect(mockClient.eq).toHaveBeenCalledWith('id', '123')
            expect(result).toEqual(updatedProject)
        })
    })

    describe('deleteProject', () => {
        it('soft deletes a project', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            const result = await deleteProject('123')

            expect(mockClient.update).toHaveBeenCalled()
            expect(result).toBe(true)
        })
    })

    describe('restoreProject', () => {
        it('restores a soft-deleted project', async () => {
            mockClient.then = (resolve: any) => resolve({ error: null })

            const result = await restoreProject('123')

            expect(mockClient.update).toHaveBeenCalledWith({
                deleted_at: null,
                deleted_by: null
            })
            expect(result).toBe(true)
        })
    })

    describe('toggleProjectPublish', () => {
        it('toggles project published status', async () => {
            const publishedProject = { id: '123', published: true }

            mockClient.then = (resolve: any) => resolve({ data: publishedProject, error: null })

            const result = await toggleProjectPublish('123', true)

            expect(mockClient.update).toHaveBeenCalledWith({ published: true })
            expect(result).toEqual(publishedProject)
        })
    })

    describe('toggleProjectFeatured', () => {
        it('toggles project featured status', async () => {
            const featuredProject = { id: '123', featured: true }

            mockClient.then = (resolve: any) => resolve({ data: featuredProject, error: null })

            const result = await toggleProjectFeatured('123', true)

            expect(mockClient.update).toHaveBeenCalledWith({ featured: true })
            expect(result).toEqual(featuredProject)
        })
    })

    describe('subscribeToProjectsChanges', () => {
        it('creates a realtime subscription', () => {
            const callback = vi.fn()

            subscribeToProjectsChanges(callback)

            expect(mockClient.channel).toHaveBeenCalledWith('projects_changes')
        })
    })
})
