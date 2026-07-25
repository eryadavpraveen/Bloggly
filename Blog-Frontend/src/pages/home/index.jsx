import BlogContainer from '@/components/blog/BlogContainer'
import React, { Fragment } from 'react'
import AnnouncementBanner from '@/components/announcement-banner'

const HomePage = () => {
    return (
        <div>

            < AnnouncementBanner />

            < BlogContainer showViewAllButton={true} isHomePage={true} />
        </div>

    )
}

export default HomePage