import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { isRtl } from '@/lib/utils';

const notFoundRoute = [
    "/order-detail",
]

const BreadCrumb = () => {
    const rtl = isRtl();
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    // const { slug } = router.query;
    useEffect(() => {
        if (router.pathname) {
            const pathArray = router.asPath.split('?')[0].split('/').filter((path) => path);
            const formattedBreadcrumbs = pathArray.map((path, index) => {
                const href = `/${pathArray.slice(0, index + 1).join('/')}`;
                return { label: decodeURIComponent(path), href };
            });
            setBreadcrumbs(formattedBreadcrumbs);
        }
    }, [router.pathname, router.asPath]);


    const handleNotFoundRoutes = (href) => {
        if (href === "/product") {
            return router.push("/products")
        }
        if (href === "/categories") {
            return router.push("/categories/all")
        }
        const notFound = notFoundRoute.includes(href)
        if (notFound) {
            return router.back();
        }
        return router.push(href);
    };

    const handleCheckBreadCrumb = () => {
        // console.log(parseInt(slug))
        if (breadcrumbs?.length === 2 && parseInt(breadcrumbs[breadcrumbs.length - 1]?.label)) {
            return breadcrumbs?.[0]?.label;
        }
        if (breadcrumbs?.length === 1) {
            return breadcrumbs?.[0]?.label;
        }
        return breadcrumbs[1]?.label
    }



    return (
        <section className="p-3 md:p-6 breadCrumbBg">
            <div className=" container px-2">
                <div className='flex justify-between flex-col gap-1 md:flex-row'>
                    <p className="text-xl font-bold capitalize">
                        {breadcrumbs.length ? handleCheckBreadCrumb() : 'Home'}
                    </p>
                    <div className="flex gap-1 items-center overflow-hidden ">
                        <Link href="/" className="text-sm font-bold capitalize">
                            Home
                        </Link>

                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center gap-1 max-w-[150px]">
                                {rtl ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
                                {index === breadcrumbs.length - 1 ? (
                                    <span
                                        className="text-sm font-bold capitalize cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
                                        style={{ maxWidth: '100%' }}
                                        title={crumb.label} // Tooltip to show full text on hover
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <div
                                        // href={handleNotFoundRoutes(crumb.href)}
                                        onClick={() => handleNotFoundRoutes(crumb.href)}
                                        className="text-sm font-bold capitalize text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
                                        style={{ maxWidth: '100%' }}
                                        title={crumb.label} // Tooltip to show full text on hover
                                    >
                                        {crumb.label}
                                    </div>
                                )}
                            </div>

                        ))}


                    </div>
                </div>

            </div>
        </section>
    );
};

export default BreadCrumb;
