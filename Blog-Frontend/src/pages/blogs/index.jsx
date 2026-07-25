import BlogContainer from '@/components/blog/BlogContainer'

const RootBlogPage = ({ isHomePage }) => {


    return (
        <div>
            <BlogContainer showViewAllButton={false} showPagination={true} isHomePage={isHomePage} />
        </div>
    )
}

export default RootBlogPage