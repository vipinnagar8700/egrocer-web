import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";

const CategoryTree = ({
    categories,
    selectedCategories,
    onCategoryChange,
    initialFilter
}) => {
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);

    // Transform categories into tree structure
    const transformCategoryData = (categories) => {
        return categories?.map(category => ({
            title: category.name,
            key: category.id,
            children: category.cat_active_childs?.length > 0
                ? transformCategoryData(category.cat_active_childs)
                : []
        }));
    };

    // Initialize tree data when categories change
    useEffect(() => {
        if (categories?.length > 0) {
            const transformedData = transformCategoryData(categories);
            setTreeData(transformedData);
        }
    }, [categories]);

    // Initialize selected categories from filter
    useEffect(() => {
        if (initialFilter?.category_id) {
            const categories = initialFilter?.category_id?.split(",");
            const catNum = categories.filter(cat => cat !== '').map(cat => parseInt(cat));
            onCategoryChange(catNum);
        }
    }, [initialFilter]);

    const handleExpandCollapse = (nodeKey) => {
        setExpandedKeys(prev =>
            prev.includes(nodeKey)
                ? prev.filter(key => key !== nodeKey)
                : [...prev, nodeKey]
        );
    };

    // Handle checkbox changes
    // const handleCheck = (checked, nodeKey, allChildKeys) => {
    //     let newSelected = [...selectedCategories];

    //     if (checked) {
    //         // Add current node and all its children
    //         newSelected = [...newSelected, nodeKey, ...allChildKeys];

    //         // Find and add parent nodes if this is their only child
    //         const findAndAddParents = (nodes, childKey) => {
    //             for (let node of nodes) {
    //                 if (node.children?.some(child => child.key === childKey)) {
    //                     if (node.children.length === 1) {
    //                         newSelected.push(node.key);
    //                         findAndAddParents(treeData, node.key);
    //                     }
    //                 }
    //                 if (node.children?.length > 0) {
    //                     findAndAddParents(node.children, childKey);
    //                 }
    //             }
    //         };

    //         findAndAddParents(treeData, nodeKey);
    //     } else {
    //         // Remove current node and all its children
    //         newSelected = newSelected.filter(key =>
    //             key !== nodeKey && !allChildKeys.includes(key)
    //         );

    //         // Find and remove parent nodes recursively
    //         const findAndRemoveParents = (nodes, childKey) => {
    //             for (let node of nodes) {
    //                 if (node.children?.some(child => child.key === childKey)) {
    //                     // Check if all children are unchecked
    //                     const allChildrenUnchecked = node.children.every(child =>
    //                         !newSelected.includes(child.key)
    //                     );

    //                     if (allChildrenUnchecked) {
    //                         // Remove the parent node
    //                         newSelected = newSelected.filter(key => key !== node.key);
    //                         // Recursively check this node's parent
    //                         findAndRemoveParents(treeData, node.key);
    //                     }
    //                 }
    //                 if (node.children?.length > 0) {
    //                     findAndRemoveParents(node.children, childKey);
    //                 }
    //             }
    //         };

    //         findAndRemoveParents(treeData, nodeKey);
    //     }

    //     // Remove duplicates
    //     newSelected = [...new Set(newSelected)];
    //     onCategoryChange(newSelected);
    // };

    const handleCheck = (checked, nodeKey, allChildKeys) => {
        let newSelected = [...selectedCategories];

        // Helper function to check if all children of a node are selected
        const areAllChildrenSelected = (node) => {
            if (!node.children?.length) return true;
            return node.children.every(child => newSelected.includes(child.key));
        };

        // Helper function to add parent nodes when all children are selected
        const addParentIfAllChildrenSelected = (nodes, childKey) => {
            for (let node of nodes) {
                if (node.children?.some(child => child.key === childKey)) {
                    if (areAllChildrenSelected(node)) {
                        newSelected.push(node.key);
                        addParentIfAllChildrenSelected(treeData, node.key);
                    }
                }
                if (node.children?.length > 0) {
                    addParentIfAllChildrenSelected(node.children, childKey);
                }
            }
        };

        if (checked) {
            // Add current node and all its children
            newSelected = [...newSelected, nodeKey, ...allChildKeys];

            // Check and add parents if all siblings are selected
            addParentIfAllChildrenSelected(treeData, nodeKey);
        } else {
            // Remove current node and all its children
            newSelected = newSelected.filter(key =>
                key !== nodeKey && !allChildKeys.includes(key)
            );

            // Find and remove parent nodes recursively
            const findAndRemoveParents = (nodes, childKey) => {
                for (let node of nodes) {
                    if (node.children?.some(child => child.key === childKey)) {
                        // Check if all children are unchecked
                        const allChildrenUnchecked = node.children.every(child =>
                            !newSelected.includes(child.key)
                        );

                        if (allChildrenUnchecked) {
                            // Remove the parent node
                            newSelected = newSelected.filter(key => key !== node.key);
                            // Recursively check this node's parent
                            findAndRemoveParents(treeData, node.key);
                        }
                    }
                    if (node.children?.length > 0) {
                        findAndRemoveParents(node.children, childKey);
                    }
                }
            };

            findAndRemoveParents(treeData, nodeKey);
        }

        // Remove duplicates
        newSelected = [...new Set(newSelected)];
        onCategoryChange(newSelected);
    };

    // Get all child keys for a node
    const getAllChildKeys = (node) => {
        let keys = [];
        if (node.children?.length > 0) {
            node.children.forEach(child => {
                keys.push(child.key);
                keys = [...keys, ...getAllChildKeys(child)];
            });
        }
        return keys;
    };

    // Recursive component to render tree nodes
    const TreeNode = ({ node }) => {
        const isExpanded = expandedKeys.includes(node.key);
        const hasChildren = node.children?.length > 0;
        const isChecked = selectedCategories.includes(node.key);
        const childKeys = getAllChildKeys(node);

        return (
            <div className="ml-1 md:ml-1.5 lg:ml-2">
                <div className="flex justify-between items-center my-2">
                    <div className='flex items-center gap-2'>
                        <Checkbox
                            className="data-[state=checked]:primaryBackColor shadow-sm border-gray-300 border-[1.5px]"
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                                handleCheck(checked, node.key, childKeys)
                            }
                        />
                        <span className="text-sm font-normal text-ellipsis">{node.title}</span>
                    </div>
                    {hasChildren && (
                        <button
                            onClick={() => handleExpandCollapse(node.key)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            {isExpanded ? (
                                <Minus className="h-4 w-4" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <div className="ml-1">
                        {node.children.map(child => (
                            <TreeNode key={child.key} node={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="overflow-y-auto px-2 pb-4 md:px-2 lg:px-4">
            {treeData.map(node => (
                <TreeNode key={node.key} node={node} />
            ))}
        </div>
    );
};

export default CategoryTree;