import { Button } from '@chakra-ui/react';
import { getCipherInfo } from 'crypto';
import Link from 'next/link';
import { MouseEventHandler, useState } from 'react';

type Props = {
    className: string;
    selectedClassName: string;
    pageNumber: number;
    totalPageNumber: number;
    hrefPrefix: string | any;
    pageRangeDisplayed: number | any;
    onClickPage: any;
};

// function getHref(hrefPrefix: string, num: number | string) {
//     if (hrefPrefix != null) {
//         return hrefPrefix + '/' + num;
//     } else {
//         return num.toString();
//     }
// }

export const Pagination = ({
    className,
    selectedClassName,
    pageNumber,
    totalPageNumber,
    hrefPrefix,
    pageRangeDisplayed,
    onClickPage,
}: Props) => {
    const paginationClassName = className;
    const [currentPage, setCurrentPage] = useState(pageNumber);

    let numArr = [];
    for (let i = 0; i < totalPageNumber; i++) {
        numArr.push(i + 1);
    }
    const nextPageNumber = Math.min(totalPageNumber, pageNumber + 1);
    const prevPageNumber = Math.max(1, pageNumber - 1);

    function handleClickPageButton(p: number | string) {
        // setCurrentPage(page);
        console.log('handleClickPageButton', p);
        return onClickPage(p);
    }

    const pageLabel = (
        hrefPrefix: string | any,
        num: number | string,
        selectedClassName: string,
        handleClick: any,
    ) => {
        return (
            <li key={'pagination' + num.toString()}>
                <Button onClick={() => handleClick(num)}>
                    <div className={selectedClassName}>{num}</div>
                </Button>
            </li>
        );
    };

    return (
        <div className={paginationClassName}>
            {pageLabel(null, 'prev', '', () =>
                handleClickPageButton(pageNumber - 1 <= 1 ? 1 : pageNumber - 1),
            )}
            {numArr.map((n) => {
                if (pageNumber == n) {
                    return pageLabel(
                        null,
                        n.toString(),
                        selectedClassName,
                        () => handleClickPageButton(n),
                    );
                } else {
                    return pageLabel(null, n.toString(), '', () =>
                        handleClickPageButton(n),
                    );
                }
            })}
            {pageLabel(null, 'next', '', () =>
                handleClickPageButton(
                    pageNumber + 1 > totalPageNumber
                        ? totalPageNumber
                        : pageNumber + 1,
                ),
            )}
        </div>
    );
};
