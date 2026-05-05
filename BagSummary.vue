<template>
    <div class="m-10">
        <Breadcrumb />
        <div class="back-button">
            <router-link :key="'HomePage'" :to="{ name: 'HomePage' }"
                class="inline-flex items-center mb-8 text-gray-600 hover:text-black">
                <BackButton alt="back" class="back-button-common" />
                <span class="text-lg">Back</span>
            </router-link>
        </div>
        <div class="order-listing-search mb-6">
            <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <!-- Department Multi-Select Dropdown -->
                <div class="lg:w-full w-full">
                    <label class="block text-sm font-semibold mb-1">Department (Max 3)</label>
                    <div class="relative" ref="departmentDropdownRef" @click.stop>
                        <button @click.stop="showDepartmentDropdown = !showDepartmentDropdown" 
                            :class="['pl-4 pr-4 py-2 border rounded-md w-full text-left bg-white flex items-center justify-between hover:bg-gray-50', selectedDepartment.length === 3 ? 'border-green-500 border-2' : 'border-gray-300']">
                            <span v-if="selectedDepartment.length > 0" class="text-gray-800">
                                {{ selectedDepartment.length }} department(s) selected
                            </span>
                            <span v-else class="text-gray-500">Select Department</span>
                            <i class="fas fa-chevron-down text-xs"></i>
                        </button>
                        
                        <!-- Max 3 Selected Indicator -->
                        <div v-if="selectedDepartment.length === 3" class="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                        
                        <!-- Multi-Select Dropdown Menu -->
                        <div v-if="showDepartmentDropdown" class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-64 overflow-y-auto" @click.stop>
                            <div class="p-2">
                                <div v-for="department in departments" :key="department.value" 
                                    :class="['flex items-center p-2 rounded cursor-pointer', selectedDepartment.includes(department.value) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100']"
                                    @click="toggleDepartment(department.value)">
                                    <input type="checkbox" 
                                        :checked="selectedDepartment.includes(department.value)"
                                        @click.stop="toggleDepartment(department.value)"
                                        class="mr-2 accent-blue-600 h-4 w-4 cursor-pointer" />
                                    <label class="flex-1 cursor-pointer" @click.stop="toggleDepartment(department.value)">{{ department.name }}</label>
                                    <span v-if="selectedDepartment.includes(department.value)" class="text-green-600 text-sm font-semibold">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Selected Departments Tags -->
                    <div v-if="selectedDepartment.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <span v-for="deptId in selectedDepartment" :key="deptId" 
                            class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {{ departments.find(d => d.value === deptId)?.name }}
                            <button @click="removeDepartment(deptId)" class="ml-1 hover:text-blue-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-layout pr-0 w-full">
            <!-- Sidebar -->
            <div class="sidebar w-64 min-h-screen bg-white shadow-lg flex-shrink-0 p-4">
                <div v-for="(item, index) in sidebarItems" :key="index"
                    :class="['sidebar-card', { active: selectedSidebar.value === item.value }, { 'disabled-tab': loading || loadingMaterialDetails || loadingBags }]"
                    @click="selectSidebar(item)">

                    <div class="sidebar-content">
                        <!-- Left Text Section -->
                        <div class="sidebar-text">
                            <h3>{{ item.name }}</h3>
                        </div>

                        <!-- Right Fixed Icon Section -->
                        <div class="sidebar-icon">
                            <i :class="item.icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-4/5">
                <!-- Main Content -->
                <div class="content">
                    <div v-if="selectedSidebar.value === 'bag_details'">
                        <!-- Horizontal Tabs with Color Separation -->
                        <div class="tabs flex space-x-2 mb-4 border-b pb-2">
                            <button v-for="tab in bagTabs" :key="tab.value"
                                :class="['tab-button', { 'active': selectedTab.value === tab.value }]"
                                @click="selectTab(tab)">

                                <!-- Left Colored Section -->
                                <div class="tab-icon">
                                    <i :class="tab.icon"></i>
                                </div>

                                <!-- Right Section with Text -->
                                <span class="tab-text">{{ tab.name }}</span>
                            </button>
                        </div>

                        <!-- Subtab Content -->
                        <div class="tab-content">
                            <!-- Active Bags Details -->
                            <div v-if="selectedTab?.value === 'active_bags'">
                                <!-- Header Section -->
                                <div class="flex flex-col bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                    <!-- Top Row: Icon & Title + Blue Cards -->
                                    <div class="flex items-center justify-between mb-3">
                                        <!-- Icon & Title -->
                                        <div class="flex items-center space-x-2">
                                            <i :class="selectedTab.icon" class="text-blue-600 text-lg"></i>
                                            <span class="text-gray-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                        </div>

                                        <!-- Right Section: Item Count & Gold Weight -->
                                        <div class="flex items-center space-x-2">
                                            <!-- Gold Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>NWT: {{ Number(localTotalGoldWeight).toFixed(3) }} gm</span>
                                            </span>
                                            <!-- Diamond Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>DWT: {{ Number(localTotalDiamondWeight).toFixed(3) }} ct</span>
                                            </span>
                                            <!-- Color Stone Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>CSWT: {{ Number(localTotalColorStoneWeight).toFixed(3) }} ct</span>
                                            </span>
                                            <!-- Gross Weight Display (Sum of NWT + DWT + CSWT converted to grams) -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>GWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2)).toFixed(3) }} gm</span>
                                            </span>
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>RGWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2) + 
                                                    (Number(jewellerySummaryData?.totalReceivedQty || 0))).toFixed(3) }} gm</span>
                                            </span>
                                            <!-- Clickable Shopping Bag Icon with Count -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 transition cursor-pointer shadow-sm">
                                                <i class="fas fa-shopping-bag text-blue-700 hover:text-blue-900"></i>
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-6 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>{{ totalItems }}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Material Summary Table -->
                                    <div class="mt-3">
                                        <div class="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition border border-gray-300" @click="showMaterialSummaryTable = !showMaterialSummaryTable">
                                            <div class="flex items-center gap-2">
                                                <h3 class="text-sm font-semibold text-gray-800">Material Summary</h3>
                                            </div>
                                            <i :class="['fas', showMaterialSummaryTable ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                        </div>
                                        <table v-if="showMaterialSummaryTable" class="border-separate border-spacing-0 bg-white rounded-lg shadow-md text-xs w-full overflow-hidden border border-gray-400 mt-1">
                                            <thead>
                                                <tr class="bg-gray-300">
                                                    <th class="px-3 py-2 border border-gray-300 text-left font-semibold"></th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold" colspan="2">In Bag</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold" colspan="2">Received</th>
                                                </tr>
                                                <tr class="bg-gray-200">
                                                    <th class="px-3 py-2 border border-gray-300 text-left font-semibold">Material</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Quantity</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pieces</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Quantity</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pieces</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Gold (gm)</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.goldQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.goldPieces).toFixed(0) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.goldReceivedQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.goldReceivedPieces).toFixed(0) }}</span>
                                                    </td>
                                                </tr>
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Diamond (ct)</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.diamondQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.diamondPieces).toFixed(0) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.diamondReceivedQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.diamondReceivedPieces).toFixed(0) }}</span>
                                                    </td>
                                                </tr>
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Color Stone (ct)</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.colorStoneQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.colorStonePieces).toFixed(0) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.colorStoneReceivedQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.colorStoneReceivedPieces).toFixed(0) }}</span>
                                                    </td>
                                                </tr>
                                                <tr class="font-bold">
                                                    <td class="px-3 py-2 border border-gray-300">Gross (gm)</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.totalQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.totalPieces).toFixed(0) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.totalReceivedQty).toFixed(3) }}</span>
                                                    </td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="allBagMaterials.length === 0" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(materialSummary.totalReceivedPieces).toFixed(0) }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Jewellery Summary Table -->
                                    <div class="mt-3">
                                        <div class="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition border border-gray-300" @click="isJewelleryOpen = !isJewelleryOpen">
                                            <div class="flex items-center gap-2">
                                                <h3 class="text-sm font-semibold text-gray-800">Jewellery Material Summary</h3>
                                            </div>
                                            <i :class="['fas', isJewelleryOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                        </div>
                                        <table v-if="isJewelleryOpen" class="border-separate border-spacing-0 bg-white rounded-lg shadow-md text-xs w-full overflow-hidden border border-gray-400 mt-1">
                                            <thead>
                                                <tr class="bg-gray-200">
                                                    <th class="px-3 py-2 border border-gray-300 text-left font-semibold"></th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold" colspan="2">In Bag</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold" colspan="2">Received</th>
                                                </tr>
                                                <tr class="bg-gray-200">
                                                    <th class="px-3 py-2 border border-gray-300 text-left font-semibold">Material</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Quantity</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pieces</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Quantity</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pieces</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <!-- Gold -->
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Gold (g)</td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.goldQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.goldPieces || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.goldReceivedQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.goldReceivedPieces || 0).toFixed(4)) }}</span>
                                                    </td>
                                                </tr>

                                                <!-- Diamond -->
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Diamond (ct)</td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.diamondQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.diamondPieces || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.diamondReceivedQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.diamondReceivedPieces || 0).toFixed(4)) }}</span>
                                                    </td>
                                                </tr>

                                                <!-- Color Stone -->
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-3 py-2 border border-gray-300 font-medium">Color Stone (ct)</td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.colorStoneQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.colorStonePieces || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.colorStoneReceivedQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.colorStoneReceivedPieces || 0).toFixed(4)) }}</span>
                                                    </td>
                                                </tr>

                                                <!-- Gross -->
                                                <tr class="font-bold">
                                                    <td class="px-3 py-2 border border-gray-300">Gross (g)</td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.totalQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.totalPieces || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-12 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.totalReceivedQty || 0).toFixed(4)) }}</span>
                                                    </td>

                                                    <td class="px-3 py-2 border border-gray-300 text-center">
                                                        <span v-if="loadingJewellerySummary" class="inline-block w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                                                        <span v-else>{{ Number(Number(jewellerySummaryData?.totalReceivedPieces || 0).toFixed(4)) }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Quality & Color Summary Table -->
                                    <div class="mt-5">
                                        <div class="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition border border-gray-300" @click="showQualityColorTable = !showQualityColorTable">
                                            <div class="flex items-center gap-2">
                                                <h3 class="text-sm font-semibold text-gray-800">Quality & Color Summary</h3>
                                            </div>
                                            <i :class="['fas', showQualityColorTable ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                                        </div>
                                        <table v-if="showQualityColorTable" class="border-separate border-spacing-0 bg-white rounded-lg shadow-md text-xs w-full overflow-hidden border border-gray-400 mt-1">
                                            <thead>
                                                <tr class="bg-gray-300">
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Quality</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Color</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Material</th>
                                                    <th colspan="2" class="px-3 py-2 border border-gray-300 text-center font-semibold">In Bag</th>
                                                    <th colspan="2" class="px-3 py-2 border border-gray-300 text-center font-semibold">Received</th>
                                                </tr>
                                                <tr class="bg-gray-200">
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold"></th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold"></th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold"></th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Qty</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pcs</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Qty</th>
                                                    <th class="px-3 py-2 border border-gray-300 text-center font-semibold">Pcs</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-if="qualityColorSummary.length === 0" class="hover:bg-gray-50">
                                                    <td colspan="7" class="px-3 py-2 border border-gray-300 text-center"><span class="inline-block w-full h-4 bg-gray-300 rounded animate-pulse"></span></td>
                                                </tr>
                                                <tr v-for="(row, idx) in qualityColorSummary" :key="idx" class="hover:bg-gray-50">
                                                    <td v-if="row.showQualityCell" :rowspan="row.qualityRowspan" class="font-semibold px-3 py-2 border border-gray-300 text-center font-medium">{{ row.quality }}</td>
                                                    <td v-if="row.showColorCell" :rowspan="row.colorRowspan" class="font-semibold px-3 py-2 border border-gray-300 text-center">{{ row.color }}</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-left font-semibold">{{ row.material }} ({{ row.unit }})</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">{{ Number(row.qty).toFixed(3) }}</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">{{ Number(row.pieces).toFixed(0) }}</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">{{ Number(row.receivedQty).toFixed(3) }}</td>
                                                    <td class="px-3 py-2 border border-gray-300 text-center">{{ Number(row.receivedPieces).toFixed(0) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="order-listing-search mb-6" v-if="!(bags.value && bags.value?.length <= 0)">
                                    <!-- Search Input Field -->
                                    <div class="w-full mb-4">
                                        <div class="relative w-full">
                                            <input type="text" v-model="searchTerm"
                                                placeholder="Search by Bag#, SO#, WO#, or Design"
                                                @input="handleSearchInput()"
                                                class="pl-12 pr-4 py-2 border rounded-md w-full" />
                                            <div
                                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SearchIcon class="search-icon" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Employee and Date Filters -->
                                    <div class="flex flex-col sm:flex-row gap-4">
                                        <!-- Employee Select Field -->
                                        <div class="flex-grow">
                                            <label class="block text-sm font-semibold mb-1">Employee<span
                                                    class="text-red-500">*</span></label>
                                            <select v-model="selectedEmployee" @change="handleSearchInput('employee')"
                                                class="pl-4 pr-4 py-2 border rounded-md w-full">
                                                <option value="">Select Employee</option>
                                                <option v-for="employee in regularEmployees" :key="employee.value"
                                                    :value="employee.value">
                                                    {{ employee.text }}
                                                </option>
                                            </select>
                                        </div>

                                        <!-- Operations Entry Date -->
                                        <div class="flex-shrink-0 sm:w-1/4 w-full">
                                            <label class="block text-sm font-semibold mb-1">Operations Entry Date</label>
                                            <input type="date" v-model="selectedDate"
                                                @change="handleSearchInput('date')"
                                                class="pl-4 pr-4 py-2 border rounded-md w-full" />
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="flex items-end sm:ml-auto">
                                            <button @click="printAllBagsData"
                                                class="pl-4 pr-4 py-2 bg-gray-400 hover:bg-gray-500 text-black rounded-md shadow-md transition-all duration-200 opacity-70 hover:opacity-100">
                                                Export Bag's Data
                                            </button>
                                        </div>

                                        <div v-if="searchTerm || selectedEmployee || selectedDate"
                                            class="flex items-end sm:ml-auto">
                                            <button @click="printFilteredBags"
                                                class="pl-4 pr-4 py-2 bg-gray-400 hover:bg-gray-500 text-black rounded-md shadow-md transition-all duration-200 opacity-70 hover:opacity-100">
                                                Print All Bags
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="loadingBags">
                                    <!-- overlay -->
                                    <div class="loader-container">
                                        <div class="loader"></div>
                                    </div>
                                </div>
                                <div v-else-if="bags?.length > 0" class="bag-list-wrapper">

                                    <label v-if="searchTerm || selectedEmployee || selectedDate"
                                        class="flex items-center gap-2">
                                        <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                                            @change="toggleSelectAll" />
                                        <span>Select / Deselect All</span>
                                    </label>


                                    <!-- Content for Bags -->
                                    <div
                                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                        <template v-for="(bag) in bags" :key="bag.bag_no_id?.value">
                                            <!-- Bag Card -->
                                            <div
                                                class="bg-[#c6cacc] shadow-md rounded-lg overflow-hidden transition-all duration-300 border hover:shadow-lg">
                                                <!-- White Section  (Clickable)-->
                                                <!-- Container -->
                                                <div class="flex flex-col h-full">
                                                    <!-- White Section (Fixed Height, Clickable) -->
                                                    <div class="bg-white p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 min-h-20 h-22"
                                                        @click="openBagDetails(bag)">
                                                        <div>

                                                            <input v-if="searchTerm || selectedEmployee || selectedDate"
                                                                type="checkbox" v-model="selectedBags"
                                                                :value="bag.bag_no_id?.value" @click.stop />

                                                            <p class="text-sm text-gray-800">
                                                                {{ bag.bag_no_name?.value || "Unnamed Bag" }}
                                                            </p>
                                                            <p class="text-xs text-gray-600">
                                                                Qty: {{ bag.quantity?.value || 0 }}
                                                            </p>
                                                        </div>

                                                        <!-- Image popup -->
                                                        <div>
                                                            <!-- Bag Card -->
                                                            <div class="relative" @click.stop>
                                                                <!-- Thumbnail Image (Click to Open Popup) -->
                                                                <div v-if="bag.item_image?.value"
                                                                    class="cursor-pointer">
                                                                    <!-- <img :src="placeholderImage + bag.item_image?.text"
                                                                        class="w-12 h-12 object-cover rounded transition-transform duration-200 hover:scale-105"
                                                                        @click="openPopup(placeholderImage + bag.item_image?.text, bag.bag_no_id?.value)" /> -->
                                                                    <img :src="placeholderImage + bag.item_image?.text"
                                                                        class="w-12 h-12 object-cover rounded transition-transform duration-200 hover:scale-105 cursor-pointer"
                                                                        @click="openImage(placeholderImage + bag.item_image?.text, bag.bag_no_id?.text)" />
                                                                </div>
                                                            </div>

                                                            <!-- Global Image Popup Modal (Move Outside the Loop) -->
                                                            <!-- <transition name="fade">
                                                                <div v-if="isPopupOpen & (bagImageId === bag.bag_no_id?.value)"
                                                                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                                                    @click.stop="closePopup">
                                                                    <div class="relative bg-white rounded-lg shadow-lg p-2 transition-transform duration-300 transform scale-95 hover:scale-100"
                                                                        @click.stop>

                                                                        <button
                                                                            class="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                                                                            @click="closePopup">
                                                                            ✕
                                                                        </button>

                                                                        <img :src="imageUrl"
                                                                            class="w-96 h-auto rounded-lg" />
                                                                    </div>
                                                                </div>
                                                            </transition> -->
                                                        </div>
                                                    </div>

                                                    <!-- Black Section (Flexible Height, Expands) -->
                                                    <div class="flex-1 bg-gray p-4 text-sm flex flex-col">
                                                        <!-- Left Content -->
                                                        <div class="flex-1">
                                                            <p class="text-black text-xs font-bold mb-1">
                                                                {{ bag.department?.text || bag.department_name?.text || bag.department_name?.value || "N/A" }}
                                                            </p>
                                                            <p class="text-black">
                                                                {{ bag.design?.value || "N/A" }}
                                                            </p>
                                                            <p>
                                                                <span class="text-black">Bag Core: </span>
                                                                <span class="text-black">
                                                                    {{ bag.bag_core_tracking?.text?.trim() || "N/A" }}
                                                                </span>
                                                            </p>
                                                            <p class="text-black">
                                                                {{ bag.work_order_id?.text?.split("#")?.pop() || "N/A"
                                                                }}
                                                            </p>
                                                            <p class="text-black">
                                                                {{ bag.customer_name?.value || bag.customer?.text }}
                                                            </p>
                                                            
                                                            <!-- Weight Information -->
                                                            <div class="mt-2 pt-2 border-t border-gray-400">
                                                                <div class="text-xs text-black space-y-1">
                                                                    <p>NWT: {{ getBagWeights(bag.bag_no_id?.value).nwt }} gm</p>
                                                                    <p>DWT: {{ getBagWeights(bag.bag_no_id?.value).dwt }} ct</p>
                                                                    <p>CSWT: {{ getBagWeights(bag.bag_no_id?.value).cswt }} ct</p>
                                                                    <p class="font-bold">GWT: {{ getBagWeights(bag.bag_no_id?.value).gwt }} gm</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="self-end mt-auto relative group cursor-pointer">
                                                            <!-- Print Icon -->
                                                            <i :class="selectedTab.printIcon"
                                                                class="text-black text-lg transition-transform duration-200 group-hover:text-gray-600 group-hover:scale-110"
                                                                @click="printPDF(bag.bag_no_id?.value)"></i>

                                                            <!-- Tooltip -->
                                                            <div
                                                                class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                Print
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </template>
                                    </div>

                                    <!-- Pagination -->
                                    <pagination v-if="totalPages > 1" :total-items="totalItems"
                                        :items-per-page="itemsPerPage" :current-page="currentPage"
                                        @page-change="changePage"></pagination>
                                </div>

                                <!-- No Results -->
                                <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                    No available bags found.
                                </div>
                            </div>


                            <!-- Bag To Move Details -->
                            <div v-else-if="selectedTab?.value === 'bags_to_move'">
                                <!-- Header Section with Blue Cards -->
                                <div class="flex flex-col bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                    <!-- Top Row: Icon & Title + Blue Cards -->
                                    <div class="flex items-center justify-between mb-3">
                                        <!-- Icon & Title -->
                                        <div class="flex items-center space-x-2">
                                            <i :class="selectedTab.icon" class="text-orange-700 text-lg"></i>
                                            <span class="text-orange-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                        </div>

                                        <!-- Right Section: Weight Displays & Item Count -->
                                        <div class="flex items-center space-x-2">
                                            <!-- Gold Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>NWT: {{ Number(localTotalGoldWeight).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Diamond Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>DWT: {{ Number(localTotalDiamondWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Color Stone Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>CSWT: {{ Number(localTotalColorStoneWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Gross Weight Display (Sum of NWT + DWT + CSWT converted to grams) -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>GWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2)).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Clickable Bag Icon with Count -->
                                            <router-link :key="selectedTab.value"
                                                :to="{ name: selectedTab.routeName, params: { fromDeptId: selectedDepartment.join(',') } }"
                                                class="flex items-center space-x-2 bg-orange-200 px-3 py-1 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-300 transition cursor-pointer">
                                                <i class="fas fa-shopping-bag text-orange-700 hover:text-orange-900"></i>
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-6 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>{{ totalItems }}</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="loadingBags">
                                    <!-- overlay -->
                                    <div class="loader-container">
                                        <div class="loader"></div>
                                    </div>
                                </div>
                                <div v-else-if="bagToMoveList?.length > 0" class="bag-list-wrapper">
                                    <!-- Bag Details Section -->
                                    <div>
                                        <div class="overflow-x-auto">
                                            <div class="min-h-64 overflow-y-auto p-4 rounded-md shadow-sm">
                                                <div
                                                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                    <div v-for="bag in bagToMoveList" :key="bag.bag_no?.value"
                                                        class="bg-white border border-gray-300 p-2 rounded-md text-center shadow-md text-sm text-gray-700 hover:bg-gray-100">
                                                        <p>
                                                            <span class="text-xs text-gray-500">Bag No: </span>
                                                            <span class="text-sm font-semibold">
                                                                {{ bag.bag_no?.text || "N/A" }}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Pagination -->
                                        <pagination v-if="totalPages > 1" :total-items="totalItems"
                                            :items-per-page="shortItemsPerPage" :current-page="currentPage"
                                            @page-change="changePage"></pagination>
                                    </div>
                                </div>

                                <!-- No Results -->
                                <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                    No available bags found.
                                </div>
                            </div>

                            <!-- Bag to Acknowledge -->
                            <div v-else-if="selectedTab?.value === 'bags_to_acknowledge'">
                                <!-- Header Section -->
                                <div class="flex flex-col bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                    <!-- Top Row: Icon & Title + Blue Cards -->
                                    <div class="flex items-center justify-between mb-3">
                                        <!-- Icon & Title -->
                                        <div class="flex items-center space-x-2">
                                            <i :class="selectedTab.icon" class="text-green-700 text-lg"></i>
                                            <span class="text-gray-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                        </div>

                                        <!-- Right Section: Weight Displays & Item Count -->
                                        <div class="flex items-center space-x-2">
                                            <!-- Gold Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>NWT: {{ Number(localTotalGoldWeight).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Diamond Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>DWT: {{ Number(localTotalDiamondWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Color Stone Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>CSWT: {{ Number(localTotalColorStoneWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Gross Weight Display (Sum of NWT + DWT + CSWT converted to grams) -->
                                             <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>GWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2)).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Clickable Handshake Icon with Count -->
                                            <router-link :key="selectedTab.value"
                                                :to="{ name: selectedTab.routeName, params: { deptId: selectedDepartment.join(',') } }"
                                                class="flex items-center space-x-2 bg-green-200 px-3 py-1 rounded-md text-sm font-medium text-green-700 hover:bg-green-300 transition cursor-pointer">
                                                <i class="fas fa-handshake text-green-700 hover:text-green-900"></i>
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-6 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>{{ totalItems }}</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="loadingBags">
                                    <!-- overlay -->
                                    <div class="loader-container">
                                        <div class="loader"></div>
                                    </div>
                                </div>
                                <div v-else-if="bagsToAcknowledgeList?.length > 0" class="bag-list-wrapper">
                                    <!-- Bag Details Section -->
                                    <div>
                                        <div class="overflow-x-auto">
                                            <div class="min-h-64 overflow-y-auto p-4 rounded-md shadow-sm">
                                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div v-for="bag in bagsToAcknowledgeList" :key="bag.bag_no?.value"
                                                        class="bg-white border border-gray-300 p-2 rounded-md text-center shadow-md text-sm text-gray-700 hover:bg-gray-100">
                                                        <p>
                                                            <span class="text-xs text-gray-500">Bag No: </span>
                                                            <span class="text-sm font-semibold">
                                                                {{ bag.bag_no?.text || "N/A" }}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Pagination -->
                                        <pagination v-if="totalPages > 1" :total-items="totalItems"
                                            :items-per-page="shortItemsPerPage" :current-page="currentPage"
                                            @page-change="changePage"></pagination>
                                    </div>
                                </div>

                                <!-- No Results -->
                                <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                    No available bags found.
                                </div>
                            </div>

                            <!-- Bag To Reject Details -->
                            <div v-else-if="selectedTab?.value === 'bags_rejected'">
                                <!-- Header Section -->
                                <div class="flex flex-col bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                    <!-- Top Row: Icon & Title + Blue Cards -->
                                    <div class="flex items-center justify-between mb-3">
                                        <!-- Icon & Title -->
                                        <div class="flex items-center space-x-2">
                                            <i :class="selectedTab.icon" class="text-red-700 text-lg"></i>
                                            <span class="text-gray-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                        </div>

                                        <!-- Right Section: Weight Displays & Item Count -->
                                        <div class="flex items-center space-x-2">
                                            <!-- Gold Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>NWT: {{ Number(localTotalGoldWeight).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Diamond Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>DWT: {{ Number(localTotalDiamondWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Color Stone Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>CSWT: {{ Number(localTotalColorStoneWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Gross Weight Display (Sum of NWT + DWT + CSWT converted to grams) -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>GWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2)).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Clickable Rejection Icon with Count -->
                                            <router-link :key="selectedTab.value"
                                                :to="{ name: selectedTab.routeName, params: { deptId: selectedDepartment.join(',') } }"
                                                class="flex items-center space-x-2 bg-red-200 px-3 py-1 rounded-md text-sm font-medium text-red-700 hover:bg-red-300 transition cursor-pointer">
                                                <i class="fas fa-ban text-red-700 hover:text-red-900"></i>
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-6 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>{{ totalItems }}</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="loadingBags">
                                    <!-- overlay -->
                                    <div class="loader-container">
                                        <div class="loader"></div>
                                    </div>
                                </div>
                                <div v-else-if="bagsRejectedList?.length > 0" class="bag-list-wrapper">
                                    <!-- Bag Details Section -->
                                    <div>
                                        <div class="overflow-x-auto">
                                            <div class="min-h-64 overflow-y-auto p-4 rounded-md shadow-sm">
                                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div v-for="bag in bagsRejectedList" :key="bag.bag_no?.value"
                                                        class="bg-white border border-gray-300 p-2 rounded-md text-center shadow-md text-sm text-gray-700 hover:bg-gray-100">
                                                        <p>
                                                            <span class="text-xs text-gray-500">Bag No: </span>
                                                            <span class="text-sm font-semibold">
                                                                {{ bag.bag_no_name?.value || "N/A" }}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Pagination -->
                                        <pagination v-if="totalPages > 1" :total-items="totalItems"
                                            :items-per-page="shortItemsPerPage" :current-page="currentPage"
                                            @page-change="changePage"></pagination>
                                    </div>
                                </div>

                                <!-- No Results -->
                                <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                    No available bags found.
                                </div>
                            </div>

                            <!-- Overdue Bags Details -->
                            <div v-else-if="selectedTab?.value === 'bags_overdue'">
                                <!-- Header Section -->
                                <div class="flex flex-col bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                    <!-- Top Row: Icon & Title + Blue Cards -->
                                    <div class="flex items-center justify-between mb-3">
                                        <!-- Icon & Title -->
                                        <div class="flex items-center space-x-2">
                                            <i :class="selectedTab.icon" class="text-yellow-600 text-lg"></i>
                                            <span class="text-gray-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                        </div>

                                        <!-- Right Section: Weight Displays & Item Count -->
                                        <div class="flex items-center space-x-2">
                                            <!-- Gold Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>NWT: {{ Number(localTotalGoldWeight).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Diamond Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>DWT: {{ Number(localTotalDiamondWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Color Stone Weight Display -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>CSWT: {{ Number(localTotalColorStoneWeight).toFixed(2) }} ct</span>
                                            </span>
                                            <!-- Gross Weight Display (Sum of NWT + DWT + CSWT converted to grams) -->
                                            <span
                                                class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-bold text-blue-800 shadow-sm">
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-20 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>GWT: {{ (Number(localTotalGoldWeight) +
                                                    (Number(localTotalDiamondWeight) * 0.2) +
                                                    (Number(localTotalColorStoneWeight) * 0.2)).toFixed(2) }} gm</span>
                                            </span>
                                            <!-- Clickable Overdue Icon with Count -->
                                            <span
                                                class="flex items-center space-x-2 bg-yellow-200 px-3 py-1 rounded-md text-sm font-medium text-yellow-800 transition cursor-pointer shadow-sm">
                                                <i
                                                    class="fas fa-exclamation-triangle text-yellow-700 hover:text-yellow-900"></i>
                                                <span v-if="allBagMaterials.length === 0" class="inline-block w-6 h-4 bg-gray-400 rounded animate-pulse"></span>
                                                <span v-else>{{ totalItems }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="loadingBags">
                                    <!-- overlay -->
                                    <div class="loader-container">
                                        <div class="loader"></div>
                                    </div>
                                </div>
                                <div v-else-if="bagsOverdueList?.length > 0" class="bag-list-wrapper">
                                    <!-- Bag Details Section -->
                                    <div>
                                        <div class="overflow-x-auto">
                                            <div class="min-h-64 overflow-y-auto p-4 rounded-md shadow-sm">
                                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div v-for="bag in bagsOverdueList" :key="bag.bag_no?.value"
                                                        class="bg-white border border-gray-300 p-2 rounded-md text-center shadow-md text-sm text-gray-700 hover:bg-gray-100"
                                                        :class="['bg-white border border-gray-300 p-2 rounded-md text-center shadow-md text-sm text-gray-700 hover:bg-gray-100', getCardColor(bag.duedate?.value)]">
                                                        <p>
                                                            <span class="text-xs text-gray-500">Bag No: </span>
                                                            <span class="text-sm font-semibold">{{ bag.bag_no_name?.value || "N/A" }}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Pagination -->
                                        <pagination v-if="totalPages > 1" :total-items="totalItems"
                                            :items-per-page="shortItemsPerPage" :current-page="currentPage"
                                            @page-change="changePage"></pagination>
                                    </div>
                                </div>

                                <!-- No Results -->
                                <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                    No available bags found.
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- div for Materials overdue side bar-->
                    <div v-else-if="selectedSidebar.value === 'material_overdue_details'">
                        <!-- Active Bags Details -->
                        <div>
                            <!-- Header Section -->
                            <div class="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md shadow-sm mb-4">
                                <!-- Icon & Title -->
                                <div class="flex items-center space-x-2">
                                    <i :class="selectedTab.icon" class="text-blue-600 text-lg"></i>
                                    <span class="text-gray-800 font-semibold text-sm">{{ selectedTab.name }}</span>
                                </div>

                                <!-- Clickable Shopping Bag Icon with Count -->
                                <span class="flex items-center space-x-2 bg-blue-200 px-3 py-1 rounded-md text-sm font-medium text-blue-800 transition cursor-pointer shadow-sm">
                                    <i class="fas fa-shopping-bag text-blue-700 hover:text-blue-900"></i>
                                    <span>{{ totalItems }}</span>
                                </span>
                            </div>

                            <div class="order-listing-search mb-6" v-if="!(bags.value && bags.value?.length <= 0)">
                                <div class="flex flex-wrap gap-4 items-end w-full mb-4">
                                    <!-- Search Input Field -->
                                    <div class="flex-1 min-w-[220px]">
                                        <div class="relative">
                                            <input type="text" v-model="searchTerm"
                                                placeholder="Search Bag # or Order..." @input="handleSearchInput()"
                                                class="pl-12 pr-4 py-2 border rounded-md w-full"
                                                aria-label="Search bags and orders">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SearchIcon class="search-icon w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Overdue Days Input Field -->
                                    <div class="flex-1 min-w-[220px]">
                                        <div class="flex items-center gap-2">
                                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Overdue for:</label>
                                            <div class="relative flex-1">
                                                <input type="number" v-model.number="overdueDays" :min="0" :step="1"
                                                    @input="triggerFetchOverdueBags()" @keydown="handleKeydown($event)"
                                                    placeholder="0" class="pl-3 pr-8 py-2 border rounded-md w-full"
                                                    title="Enter whole number of days"
                                                    aria-label="Enter overdue days threshold">
                                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="loadingBags">
                                <!-- overlay -->
                                <div class="loader-container">
                                    <div class="loader"></div>
                                </div>
                            </div>
                            <div v-else-if="bags?.length > 0" class="bag-list-wrapper">
                                <!-- Content for Bags -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                    <template v-for="(bag) in bags" :key="bag.bag_no_id?.value">
                                        <!-- Bag Card -->
                                        <div class="bg-[#c6cacc] shadow-md rounded-lg overflow-hidden transition-all duration-300 border hover:shadow-lg">
                                            <!-- White Section  (Clickable)-->
                                            <!-- Container -->
                                            <div class="flex flex-col h-full">
                                                <!-- White Section (Fixed Height, Clickable) -->
                                                <div class="bg-white p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 min-h-20 h-22"
                                                    @click="openBagDetails(bag)">
                                                    <div>
                                                        <p class="text-sm text-gray-800">
                                                            {{ bag.bag_no_name?.value || "Unnamed Bag" }}
                                                        </p>
                                                        <p class="text-xs text-gray-600">
                                                            Qty: {{ bag.quantity?.value || 0 }}
                                                        </p>
                                                    </div>

                                                    <!-- Image popup -->
                                                    <div>
                                                        <!-- Bag Card -->
                                                        <div class="relative" @click.stop>
                                                            <!-- Thumbnail Image (Click to Open Popup) -->
                                                            <div v-if="bag.item_image?.value" class="cursor-pointer">
                                                                <!-- <img :src="placeholderImage + bag.item_image?.text"
                                                                    class="w-12 h-12 object-cover rounded transition-transform duration-200 hover:scale-105"
                                                                    @click="openPopup(placeholderImage + bag.item_image?.text, bag.bag_no_id?.value)" /> -->
                                                                <img :src="placeholderImage + bag.item_image?.text"
                                                                    class="w-12 h-12 object-cover rounded transition-transform duration-200 hover:scale-105 cursor-pointer"
                                                                    @click="openImage(placeholderImage + bag.item_image?.text, bag.bag_no_name?.value)" />
                                                            </div>
                                                        </div>

                                                        <!-- Global Image Popup Modal (Move Outside the Loop) -->
                                                        <!-- <transition name="fade">
                                                            <div v-if="isPopupOpen & (bagImageId === bag.bag_no_id?.value)"
                                                                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                                                @click.stop="closePopup">
                                                                <div class="relative bg-white rounded-lg shadow-lg p-2 transition-transform duration-300 transform scale-95 hover:scale-100"
                                                                    @click.stop>

                                                                    <button
                                                                        class="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                                                                        @click="closePopup">
                                                                        ✕
                                                                    </button>

                                                                    <img :src="imageUrl"
                                                                        class="w-96 h-auto rounded-lg" />
                                                                </div>
                                                            </div>
                                                        </transition> -->
                                                    </div>
                                                </div>

                                                <!-- Black Section (Flexible Height, Expands) -->
                                                <div class="flex-1 bg-gray p-4 text-sm flex flex-col">
                                                    <!-- Left Content -->
                                                    <div class="flex-1">
                                                        <p class="text-black">
                                                            {{ bag.design?.value || "N/A" }}
                                                        </p>
                                                        <p>
                                                            <span class="text-black">Bag Core: </span>
                                                            <span class="text-black">
                                                                {{ bag.bag_core_tracking?.text?.trim() || "N/A" }}
                                                            </span>
                                                        </p>
                                                        <p class="text-black">
                                                            {{ bag.work_order_id?.value?.split("#")?.pop() || "N/A" }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <!-- Pagination -->
                                <pagination v-if="totalPages > 1" :total-items="totalItems"
                                    :items-per-page="itemsPerPage" :current-page="currentPage"
                                    @page-change="changePage"></pagination>
                            </div>

                            <!-- No Results -->
                            <div v-else-if="noResultsFound" class="No-items text-center pt-5 text-lg">
                                No available bags found.
                            </div>
                        </div>
                    </div>

                    <div v-else-if="selectedSidebar.value === 'gold_type' || selectedSidebar.value === 'diamond_type' || selectedSidebar.value === 'color_stone_type'" class="overflow-x-auto">
                        <div>
                            <!-- Search Input Field -->
                            <div class="w-full mb-4">
                                <div class="relative w-full">
                                    <input type="text" v-model="searchTerm" placeholder="Search by Bag#, SO#, or WO#"
                                        @input="handleSearchInput()" class="pl-12 pr-4 py-2 border rounded-md w-full" />
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon class="search-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="loadingMaterialDetails">
                            <!-- overlay -->
                            <div class="loader-container">
                                <div class="loader"></div>
                            </div>
                        </div>
                        <div v-else-if="specificMaterialDetailsList.length">
                            <!-- <h2>{{ selectedSidebar.name }}</h2> -->
                            <div class="overflow-x-auto">
                                <table class="w-full border-collapse bg-white shadow-md rounded-md text-md">
                                    <thead>
                                        <tr class="bg-gray-100 text-left text-md border-b-2 border-gray-300">
                                            <th rowspan="2"
                                                class="px-2 py-2 w-[30%] break-words border-r-2 border-gray-300">
                                                Item Name
                                            </th>
                                            <th colspan="7" class="px-2 py-2 text-center border-r-2 bg-gray-150">
                                                Quantity
                                            </th>
                                            <th colspan="7" class="px-2 py-2 text-center bg-gray-150">Pieces</th>
                                        </tr>
                                        <tr class="bg-gray-100 text-left text-md border-b-2 border-black">
                                            <!-- Quantity Data Columns -->
                                            <th class="px-2 py-2 w-[6%] border-r">Total Needed</th>
                                            <th class="px-2 py-2 w-[6%] border-r">Total Issued</th>
                                            <th class="px-2 py-2 w-[7%] border-r">To be Issued</th>
                                            <th class="px-2 py-2 w-[7%] border-r">In Bag</th>
                                            <th class="px-2 py-2 w-[7%] border-r">Total Received</th>
                                            <th class="px-2 py-2 w-[7%] border-r">Total Loss</th>
                                            <th class="px-2 py-2 w-[7%] border-r-2">Total Balance</th>
                                            <!-- Pieces Data Columns -->
                                            <th class="px-2 py-2 w-[6%] border-r">Total Needed</th>
                                            <th class="px-2 py-2 w-[6%] border-r">Total Issued</th>
                                            <th class="px-2 py-2 w-[7%] border-r">To be Issued</th>
                                            <th class="px-2 py-2 w-[7%] border-r">In Bag</th>
                                            <th class="px-2 py-2 w-[7%] border-r">Total Received</th>
                                            <th class="px-2 py-2 w-[7%] border-r">Total Loss</th>
                                            <th class="px-2 py-2 w-[7%] border-r">Total Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in specificMaterialDetailsList" :key="item.itemId" class="border-b hover:bg-gray-50 text-md">
                                            <!-- Item Name Column -->
                                            <td class="px-2 py-2 border-r-2 border-black">{{ item.itemName }}</td>
                                            <!-- Quantity Data Columns -->
                                            <td class="px-2 py-2 border-r">{{ item.quantity }}</td>
                                            <td class="px-2 py-2 border-r">{{ item.totalIssue }}</td>
                                            <td class="px-2 py-2 border-r">{{ item.toIssue }}</td>
                                            <td class="px-2 py-2 border-r">{{ item.quantityInBag }}</td>
                                            <td class="px-2 py-2 border-r">{{ item.totalReceive }}</td>
                                            <td class="px-2 py-2 border-r">{{ item.totalLossQty }}
                                            </td>
                                            <td class="px-2 py-2 border-r-2 border-black">{{ item.balanceQty }}
                                            </td>
                                            <!-- Pieces Data Columns -->
                                            <td class="px-2 py-2 border-r text-center">{{ item.pieces }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.piecesIssued }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.piecesToIssue }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.piecesInBag }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.piecesReceived }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.piecesLoss }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ item.balancepieces }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="border-b bg-gray-100 text-md border-t-2 border-t-black font-bold">
                                            <!-- Item Name Column -->
                                            <td class="px-2 py-2 border-r-2 border-black">Totals</td>
                                            <!-- Quantity Data Columns -->
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.quantity?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.totalIssue?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.toIssue?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.quantityInBag?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.totalReceive?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r">{{ Number(columnTotals.totalLossQty?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r-2 border-black">{{ Number(columnTotals.balanceQty?.toFixed(4)) }}</td>
                                            <!-- Pieces Data Columns -->
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.pieces?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.piecesIssued?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.piecesToIssue?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.piecesInBag?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.piecesReceived?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.piecesLoss?.toFixed(4)) }}</td>
                                            <td class="px-2 py-2 border-r text-center">{{ Number(columnTotals.balancepieces?.toFixed(4)) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-center h-64 bg-white shadow-md rounded-md">
                            <p class="text-gray-600 text-lg font-semibold">No Data Found</p>
                        </div>
                    </div>
                    <div v-else>
                        <p>Please select a sidebar option.</p>
                    </div>
                </div>
            </div>
        </div>

        <MaterialDetailsPopUp v-if="showMaterialDetailsPopUp" :bagId="selectedBagId" :bagName="selectedBagName"
            @close-popup="closeBagDetails" />

        <ImageZoomModal v-if="showImg" :open="showImg" :title="bagImageId" :regular="currentImageUrl"
            :zoom="currentImageUrl" :zoom-amount="3" :max-zoom-amount="8" :zoom-step="0.5" :click-zoom="true"
            @close-popup="handleImageClose" />
    </div>

</template>

<script>

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toast-notification";
import { useAllBagSummaryApi } from "@/composables/reports-api/bag-summary-api/fetchBagSummayApi";
import { useDebounceFn } from "@vueuse/core";

import Pagination from "@/components/CommonPagination.vue";
import SearchIcon from "@/assets/images/SearchIcon.vue";
import BackButton from "@/assets/images/BackButton.vue";
import Loader from "@/components/Loader.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CancelIcon from "@/assets/images/Cancel.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { useUserStore } from '@/stores/userStore';
// import IssuePopUp from "./IssuePopUp.vue";
import MaterialDetailsPopUp from "./MaterialDetailsPopUp.vue";
import { list } from "postcss";
import { ENV_VAR } from "@/shared/constants";
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ImageZoomModal from '@/components/ImageZoomModal.vue';

export default {
    name: "BagSummary",
    components: {
        Pagination,
        SearchIcon,
        BackButton,
        Loader,
        Breadcrumb,
        CancelIcon,
        ConfirmationModal,
        // IssuePopUp,
        MaterialDetailsPopUp,
        ImageZoomModal,
    },
    props: {
        workOrderName: { type: String, default: "" }
    },
    setup(props) {
        const toast = useToast();
        const userStore = useUserStore();
        const {
            listDepartments,
            listActiveBags,
            fetchListDepartments,
            fetchListActiveBags,
            loading,
            error,
            fetchListBagComponents,
            bagComponentsList,
            fetchGetBagLotSummary,
            bagJewellerySummary,
            fetchListBagToMove,
            fetchListBagsToAcknowledge,
            bagToMoveListObj,
            bagsToAcknowledgeListobj,
            specificMaterialDetailsList,
            fetchListSpecificMaterialDetails,
            fetchListRejectedBags,
            fetchListOverdueBags,
            bagsRejectedListObj,
            bagsOverdueListObj,
            generatePDFWithInternalId,
            loadingMaterialDetails,
            loadingBags,
            listEmployees,
            getDepartmentEmployeesMap,
            getAllBagData,
            allBagData,
            totalMaterialWeights,
            getTotalMaterialWeights,
            fetchBagAssemblyQualityColor,
        } = useAllBagSummaryApi();

        const placeholderImage = ref(ENV_VAR.NS_API.BASE_DOMAIN);

        const JEWELLERY_CLASS_ID = ref(ENV_VAR.CONSTANTS.CLASS_JEWELLERY);

        // Reactive Variables
        const totalItems = ref(0);
        const itemsPerPage = ref(18);
        const shortItemsPerPage = ref(60);
        const currentPage = ref(1);
        const changePageIndex = ref(false);
        const previousSearchTerm = ref("");
        const selectedDepartment = ref([]);
        const showDepartmentDropdown = ref(false);
        const departmentDropdownRef = ref(null);
        const loadingMaterialSummary = ref(false);
        const searchTerm = ref("");
        const noResultsFound = ref(false);
        const departments = ref([]);
        const isAdmin = ref(userStore.isAdmin);
        const userId = ref(userStore.userId);
        const bagToMoveList = ref([]);
        const bagsToAcknowledgeList = ref([]);
        const bagsRejectedList = ref([]);
        const bagsOverdueList = ref([]);
        const selectedDate = ref("");
        const regularEmployees = ref([]);
        const localTotalGoldWeight = ref(0);
        const localTotalDiamondWeight = ref(0);
        const localTotalColorStoneWeight = ref(0);
        const selectedEmployee = ref("");
        const selectedBags = ref([]);

        const showMaterialDetailsPopUp = ref(false);
        const selectedBagId = ref("");
        const selectedBagName = ref("");
        const displayResults = ref([]);
        const isJewelleryOpen = ref(false); // collapsed by default

        const bags = ref([]);
        const components = ref([]);
        // const loadingBags = ref(false);

        const overdueDays = ref(7); // Initialize with default value
        const previousOverdueDays = ref("");

        const jewellerySummaryData = ref({});
        const loadingJewellerySummary = ref(true);
        const jewelleryByQualityColor = ref({});

        const sidebarItems = ref([
            { name: "Bag Details", value: 'bag_details', icon: "fas fa-briefcase" },
            { name: "Material Overdue", value: 'material_overdue_details', icon: "fas fa-calendar-times" },
            { name: "Gold in Bag", value: 'gold_type', icon: "fas fa-ring" },
            { name: "Diamond in Bag", value: 'diamond_type', icon: "fas fa-gem" },
            { name: "Color Stones", value: 'color_stone_type', icon: "fas fa-palette" },
        ]);

        const bagTabs = ref([
            { value: "active_bags", name: "Bags", icon: "fas fa-shopping-bag", printIcon: "fas fa-print" },
            { value: "bags_to_move", name: "Bags to Move", icon: "fas fa-dolly", goto: "Bag Movement", routeName: "BagMovement" },
            { value: "bags_to_acknowledge", name: "Bags to Acknowledge", icon: "fas fa-handshake", goto: "Bag Acknowledgement", routeName: "BagAcknowledgement" },
            { value: "bags_rejected", name: "Rejected Bags", icon: "fas fa-ban", goto: "Bag Reject", routeName: "BagReject" },
            { value: "bags_overdue", name: "Overdue Bags", icon: "fas fa-exclamation-triangle" }
        ]);

        const selectedSidebar = ref(sidebarItems.value[0]);
        const selectedTab = ref(bagTabs.value[0]);

        const bagsToMove = ref("");
        const bagsToAcknowledge = ref("");

        const isPopupOpen = ref(false);

        const timestamp = ref("");

        const imageUrl = ref("");
        const bagImageId = ref("");
        const showImg = ref(false);
        const currentImageUrl = ref('');

        const openImage = (url, bagImageIds) => {
            console.log("Opening image:", url);
            currentImageUrl.value = url;
            bagImageId.value = bagImageIds;
            showImg.value = true // (we’ll v-if on the component)
        };

        function handleImageClose() {
            // Modal closed → reset if you want
            console.log("Closing image modal");
            showImg.value = false
            currentImageUrl.value = ''
        }

        const resetVariables = () => {
            noResultsFound.value = true;
            bags.value.length = 0;
            components.value.length = 0;
            totalItems.value = 0;
            bagToMoveListObj.value = [];
            bagsToAcknowledgeListobj.value = [];
            bagsRejectedListObj.value = [];
            bagsOverdueListObj.value = [];
            specificMaterialDetailsList.value = [];
            showMaterialDetailsPopUp.value = false;
            selectedBagId.value = "";
            selectedBagName.value = "";
        };

        const handleKeydown = (event) => {
            const restrictedKeys = ['.', ',', '-', '+', 'e', 'E'];
            if (restrictedKeys.includes(event.key)) {
                event.preventDefault();
            }
        };

        const selectSidebar = (sidebar, initial) => {
            if (selectedSidebar.value?.value == sidebar.value && !initial) return;
            if (!initial) {
                searchTerm.value = "";
                previousSearchTerm.value = "";
            }
            selectedSidebar.value = sidebar;
            if (selectedSidebar.value?.value === 'bag_details') {
                selectTab(selectedTab.value, true);
            } else if (selectedSidebar.value?.value === 'material_overdue_details') {
                fetchActiveBagsForOverdue();
            } else if (selectedSidebar.value?.value === 'gold_type' || selectedSidebar.value?.value === 'diamond_type' || selectedSidebar.value?.value === 'color_stone_type') {
                fetchSpecificMaterialDetails();
            } else {
                toast.error("Invalid Side Bar Action", { position: "top" });
            }
        };

        const selectTab = useDebounceFn((tab, initial) => {
            if (selectedTab.value?.value == tab?.value && !initial) return;
            if (!initial) {
                searchTerm.value = "";
                previousSearchTerm.value = "";
            } else {
                previousSearchTerm.value = searchTerm.value;
            }
            currentPage.value = 1;
            selectedTab.value = tab;
            if (tab?.value === "active_bags") {
                fetchActiveBags();
            } else if (tab?.value === "bags_to_move") {
                fetchBagToMove();
            } else if (tab?.value === "bags_to_acknowledge") {
                fetchBagsToAcknowledge();
            } else if (tab?.value === "bags_rejected") {
                fetchRejectedBags();
            } else if (tab?.value === "bags_overdue") {
                fetchOverdueBags();
            } else {
                toast.error("Invalid Sub Tab Action", { position: "top" });
            }
        }, 300);

        const totalPages = computed(() => {
            return Math.ceil(totalItems.value / itemsPerPage.value);
        });

        const allBagMaterials = ref([]);
        const showMaterialSummaryTable = ref(false);
        const showQualityColorTable = ref(false);
        const bagAssemblyQualityColorMap = ref({});

        const fetchAllBagMaterials = async () => {
            try {
                loadingMaterialSummary.value = true;
                allBagMaterials.value = [];

                loadingJewellerySummary.value = true;
                jewellerySummaryData.value = {};
                
                // Get all bag IDs with current filters applied
                let allBagIds = [];
                const formattedDate = selectedDate.value
                    ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                    : null;
                
                if (selectedTab.value?.value === 'active_bags') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        // params: "bag_summary_active_bags",
                        params: "active_bags",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        date: formattedDate,
                        employee: selectedEmployee.value
                    };
                    await fetchListActiveBags(payload);
                    const bagList = Array.isArray(listActiveBags.value) ? listActiveBags.value : (listActiveBags.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_to_move') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        from_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bag_movement'
                    };
                    await fetchListBagToMove(payload);
                    const bagList = Array.isArray(bagToMoveListObj.value) ? bagToMoveListObj.value : (bagToMoveListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_to_acknowledge') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        to_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bag_acknowledgement'
                    };
                    await fetchListBagsToAcknowledge(payload);
                    const bagList = Array.isArray(bagsToAcknowledgeListobj.value) ? bagsToAcknowledgeListobj.value : (bagsToAcknowledgeListobj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_rejected') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bags_rejected'
                    };
                    await fetchListRejectedBags(payload);
                    const bagList = Array.isArray(bagsRejectedListObj.value) ? bagsRejectedListObj.value : (bagsRejectedListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_overdue') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bags_overdue'
                    };
                    await fetchListOverdueBags(payload);
                    const bagList = Array.isArray(bagsOverdueListObj.value) ? bagsOverdueListObj.value : (bagsOverdueListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                }

                console.log("fetchAllBagMaterials - Total filtered bag IDs:", allBagIds.length);

                if (!allBagIds || allBagIds.length === 0) {
                    allBagMaterials.value = [];
                    console.log("fetchAllBagMaterials - No bags found, clearing materials");
                    return;
                }

                // OPTIMIZED: Fetch all materials in parallel batches (much faster than sequential)
                const allMaterials = [];
                const batchSize = 500; // Fetch materials for 500 bags per API call
                const batches = [];
                
                // Create all batch promises
                for (let i = 0; i < allBagIds.length; i += batchSize) {
                    const batch = allBagIds.slice(i, i + batchSize);
                    const batchNumber = Math.floor(i / batchSize) + 1;
                    const totalBatches = Math.ceil(allBagIds.length / batchSize);
                                        
                    // Create promise for this batch (don't await yet)
                    const batchPromise = fetchListBagComponents({ bag_id: batch })
                        .then(() => {
                            if (bagComponentsList.value && Array.isArray(bagComponentsList.value)) {
                                return [...bagComponentsList.value];
                            }
                            return [];
                        })
                        .catch(err => {
                            console.error(`Error fetching materials for batch ${batchNumber}:`, err);
                            return [];
                        });
                    
                    batches.push(batchPromise);
                }
                
                // Execute all batches in parallel
                const results = await Promise.all(batches);
                
                // Combine all results
                results.forEach(batchMaterials => {
                    allMaterials.push(...batchMaterials);
                });
                
                allBagMaterials.value = allMaterials;
                console.log("fetchAllBagMaterials - Total materials fetched from filtered bags:", allBagMaterials.value.length);

                const jewelleryLotsArray = extractJewelleryLotIds(allMaterials);
                await fetchJewellerySummary(jewelleryLotsArray);
                
                // Log all unique metal colors and qualities
                const uniqueColors = new Set();
                const uniqueQualities = new Set();
                const colorQualityPairs = new Set();
                
                allBagMaterials.value.forEach(material => {
                    const color = material.metal_color?.text || material.metal_color?.value;
                    const quality = material.metal_quality?.text || material.metal_quality?.value;
                    
                    if (color) uniqueColors.add(color);
                    if (quality) uniqueQualities.add(quality);
                    if (color && quality) colorQualityPairs.add(`${quality}|${color}`);
                });
                
                console.log("=== UNIQUE METAL COLORS ===");
                console.log(Array.from(uniqueColors).sort());
                console.log("Total unique colors:", uniqueColors.size);
                
                console.log("\n=== UNIQUE METAL QUALITIES ===");
                console.log(Array.from(uniqueQualities).sort());
                console.log("Total unique qualities:", uniqueQualities.size);
                
                console.log("\n=== QUALITY|COLOR COMBINATIONS ===");
                console.log(Array.from(colorQualityPairs).sort());
                console.log("Total combinations:", colorQualityPairs.size);
                
            } catch (err) {
                console.error("Error fetching all bag materials:", err);
                allBagMaterials.value = [];
                jewellerySummaryData.value = {};
            } finally {
                loadingMaterialSummary.value = false;
                loadingJewellerySummary.value = false;
            }
        };

        const extractJewelleryLotIds = (materials) => {
            let lotIds = materials.flatMap(item => {
                if (Number(item.item_class?.value) === Number(JEWELLERY_CLASS_ID.value)) {
                    return (item.inventoryDetail || [])
                        .map(lot => lot?.lotNumber?.value)
                        .filter(Boolean);
                }
                return [];
            });

            return [...new Set(lotIds)];
        };

        const fetchJewellerySummary = async (lotIds = []) => {
            try {
                loadingJewellerySummary.value = true;

                if (!lotIds.length) {
                    jewellerySummaryData.value = {};
                    jewelleryByQualityColor.value = {};
                    loadingJewellerySummary.value = false;
                    return;
                }

                const batchSize = 500;
                const batches = [];

                for (let i = 0; i < lotIds.length; i += batchSize) {
                    const batch = lotIds.slice(i, i + batchSize);
                    console.log("batch jewllery serials", batch);

                    const promise = (async () => {
                        try {
                            await fetchGetBagLotSummary({ serialIds: batch });
                            return JSON.parse(JSON.stringify(bagJewellerySummary.value || null));
                        } catch (err) {
                            console.error("Jewellery batch error:", err);
                            return null;
                        }
                    })();

                    batches.push(promise);
                }

                const results = await Promise.all(batches);
                console.log("Jellery Summary Result batched", results);

                // ==============================
                // MERGE SUMMARY
                // ==============================

                const finalSummary = {
                    goldQty: 0,
                    goldPieces: 0,
                    diamondQty: 0,
                    diamondPieces: 0,
                    colorStoneQty: 0,
                    colorStonePieces: 0,
                    totalQty: 0,
                    totalPieces: 0,
                    goldReceivedQty: 0,
                    goldReceivedPieces: 0,
                    diamondReceivedQty: 0,
                    diamondReceivedPieces: 0,
                    colorStoneReceivedQty: 0,
                    colorStoneReceivedPieces: 0,
                    totalReceivedQty: 0,
                    totalReceivedPieces: 0
                };

                // ==============================
                // MERGE GROUPED
                // ==============================

                const finalGrouped = {};

                const mergeSummary = (target, source) => {
                    Object.keys(target).forEach(key => {
                        target[key] += Number(source?.[key] || 0);
                    });
                };

                results.forEach(res => {
                    if (!res) return;

                    const { summary, grouped } = res;

                    // ---- merge summary ----
                    mergeSummary(finalSummary, summary);

                    // ---- merge grouped ----
                    Object.keys(grouped || {}).forEach(quality => {
                        if (!finalGrouped[quality]) {
                            finalGrouped[quality] = {};
                        }

                        Object.keys(grouped[quality]).forEach(color => {
                            if (!finalGrouped[quality][color]) {
                                finalGrouped[quality][color] = { ...finalSummary };
                                // reset to zero (important)
                                Object.keys(finalGrouped[quality][color]).forEach(k => finalGrouped[quality][color][k] = 0);
                            }

                            mergeSummary(finalGrouped[quality][color], grouped[quality][color]);
                        });
                    });
                });

                jewellerySummaryData.value = finalSummary || {};
                jewelleryByQualityColor.value = finalGrouped;
                console.log("Jewllery Summary Data", jewellerySummaryData.value);
                console.log("Jewllery Summary Data by quality and color", jewelleryByQualityColor.value);

            } catch (err) {
                console.error("Error fetching jewellery summary:", err);
                jewellerySummaryData.value = {};
                jewelleryByQualityColor.value = {};
            } finally {
                loadingJewellerySummary.value = false;
            }
        };

        // Fetch quality and color from Assembly Item (Print Design) for each bag
        const fetchQualityColorFromBags = async () => {
            try {
                console.log("fetchQualityColorFromBags - Starting");
                
                // Get all bag IDs from ALL pages (not just current page)
                let allBagIds = [];
                const formattedDate = selectedDate.value
                    ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                    : null;
                
                if (selectedTab.value?.value === 'active_bags') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        // params: "bag_summary_active_bags",
                        params: "active_bags",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        date: formattedDate,
                        employee: selectedEmployee.value
                    };
                    await fetchListActiveBags(payload);
                    const bagList = Array.isArray(listActiveBags.value) ? listActiveBags.value : (listActiveBags.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_to_move') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        from_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bag_movement'
                    };
                    await fetchListBagToMove(payload);
                    const bagList = Array.isArray(bagToMoveListObj.value) ? bagToMoveListObj.value : (bagToMoveListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_to_acknowledge') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        to_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bag_acknowledgement'
                    };
                    await fetchListBagsToAcknowledge(payload);
                    const bagList = Array.isArray(bagsToAcknowledgeListobj.value) ? bagsToAcknowledgeListobj.value : (bagsToAcknowledgeListobj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_rejected') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bags_rejected'
                    };
                    await fetchListRejectedBags(payload);
                    const bagList = Array.isArray(bagsRejectedListObj.value) ? bagsRejectedListObj.value : (bagsRejectedListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                } else if (selectedTab.value?.value === 'bags_overdue') {
                    const payload = {
                        page_index: null,
                        bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                        page_size: 10000,
                        department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                        params: 'bags_overdue'
                    };
                    await fetchListOverdueBags(payload);
                    const bagList = Array.isArray(bagsOverdueListObj.value) ? bagsOverdueListObj.value : (bagsOverdueListObj.value?.bagList || []);
                    allBagIds = bagList.map(b => b.bag_no_id?.value || b.bag_no?.value).filter(id => id);
                }

                console.log("fetchQualityColorFromBags - Total bag IDs:", allBagIds.length);

                if (!allBagIds || allBagIds.length === 0) {
                    console.log("fetchQualityColorFromBags - No bags found");
                    return;
                }

                // Fetch Assembly Item quality and color for each bag from backend
                let result = null;
                try {
                    const qualityColorData = await fetchBagAssemblyQualityColor({
                        bag_ids: allBagIds
                    });

                    console.log("fetchBagAssemblyQualityColor response:", qualityColorData);

                    if (!qualityColorData || Object.keys(qualityColorData).length === 0) {
                        console.log("fetchQualityColorFromBags - No quality/color data from backend");
                        return;
                    }

                    result = { data: qualityColorData };
                } catch (fetchErr) {
                    console.error("Error fetching quality/color data:", fetchErr);
                    return;
                }

                const bagQualityColorMap = result.data; // bagId → { quality, color }
                
                // Store in reactive variable for use in qualityColorSummary computed property
                bagAssemblyQualityColorMap.value = bagQualityColorMap;
                console.log("bagAssemblyQualityColorMap updated:", bagAssemblyQualityColorMap.value);

                // Extract unique colors and qualities from Assembly Items
                // IMPORTANT: Each bag should have exactly ONE quality (from Assembly Item)
                const uniqueColors = new Set();
                const uniqueQualities = new Set();
                const colorQualityPairs = new Set();
                const bagQualityColorPairs = {}; // bagId → quality|color pair
                
                Object.entries(bagQualityColorMap).forEach(([bagId, data]) => {
                    const quality = data.quality?.text || data.quality?.value;
                    const color = data.color?.text || data.color?.value;
                                        
                    if (quality || color) {
                        if (quality) uniqueQualities.add(quality);
                        if (color) uniqueColors.add(color);
                        if (quality && color) {
                            const pair = `${quality}|${color}`;
                            colorQualityPairs.add(pair);
                            bagQualityColorPairs[bagId] = pair;
                        }
                    }
                });
                
                console.log("=== UNIQUE METAL COLORS (from Assembly Items) ===");
                console.log(Array.from(uniqueColors).sort());
                console.log("Total unique colors:", uniqueColors.size);
                
                console.log("\n=== UNIQUE METAL QUALITIES (from Assembly Items) ===");
                console.log(Array.from(uniqueQualities).sort());
                console.log("Total unique qualities:", uniqueQualities.size);
                
                console.log("\n=== QUALITY|COLOR COMBINATIONS (from Assembly Items) ===");
                console.log(Array.from(colorQualityPairs).sort());
                console.log("Total combinations:", colorQualityPairs.size);
                
                console.log("\n=== BAG TO QUALITY|COLOR MAPPING ===");
                console.log("Bags with quality/color:", Object.keys(bagQualityColorPairs).length);
                
            } catch (err) {
                console.error("Error in fetchQualityColorFromBags:", err);
            }
        };

        const materialSummary = computed(() => {
            // Material class IDs for filtering - from environment variables
            const GOLD_CLASS_IDS = Array.isArray(ENV_VAR.CONSTANTS.CLASS_GOLD) 
                ? ENV_VAR.CONSTANTS.CLASS_GOLD 
                : (ENV_VAR.CONSTANTS.CLASS_GOLD || "")
                    .split(",")
                    .map(v => Number(v.trim()))
                    .filter(v => !isNaN(v));
            const DIAMOND_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_DIAMOND || 0);
            const COLOR_STONE_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_COLOR_STONE || 0);

            let goldQty = 0;
            let goldPieces = 0;
            let diamondQty = 0;
            let diamondPieces = 0;
            let colorStoneQty = 0;
            let colorStonePieces = 0;
            
            let goldReceivedQty = 0;
            let goldReceivedPieces = 0;
            let diamondReceivedQty = 0;
            let diamondReceivedPieces = 0;
            let colorStoneReceivedQty = 0;
            let colorStoneReceivedPieces = 0;

            // Use the allBagMaterials array
            if (allBagMaterials.value && Array.isArray(allBagMaterials.value)) {
                console.log("materialSummary - Processing materials:", allBagMaterials.value.length, "items");
                allBagMaterials.value.forEach((item, index) => {
                    // Get the item class ID from item_class field
                    const classId = Number(item.item_class?.value || 0);
                    
                    // In Bag - Quantity: Actual - To Be Issued quantities
                    const actualQty = Number(item.Quantity?.value || 0);
                    const toIssueQty = Number(item.to_issue?.value || 0);
                    const inBagQty = actualQty - toIssueQty;
                    
                    // In Bag - Pieces: (Actual Pieces Info - To Be Issued pieces)
                    const actualPiecesInfo = Number(item.actual_pieces_info?.value || 0);
                    const toBeIssuedPiecesInfo = Number(item.to_be_issued_pieces_info?.value || 0);
                    const inBagPieces = actualPiecesInfo - toBeIssuedPiecesInfo;
                    
                    // Received - Quantity: Total Receive from modal
                    const totalReceiveQty = Number(item.total_receive?.value || 0);
                    
                    // Received - Pieces: Total Received Pieces Info
                    const receivedPieces = Number(item.received_pieces_info?.value || 0);

                    // console.log(`Item ${index}: classId=${classId}, inBagQty=${inBagQty} (actual=${actualQty} - toIssue=${toIssueQty}), inBagPieces=${inBagPieces} (actual=${actualPiecesInfo} - toBeIssued=${toBeIssuedPiecesInfo}), totalReceiveQty=${totalReceiveQty}, receivedPieces=${receivedPieces}`);

                    if (GOLD_CLASS_IDS.includes(classId)) {
                        goldQty += inBagQty;
                        goldPieces += inBagPieces;
                        goldReceivedQty += totalReceiveQty;
                        goldReceivedPieces += receivedPieces;
                    } else if (classId === DIAMOND_CLASS_ID) {
                        diamondQty += inBagQty;
                        diamondPieces += inBagPieces;
                        diamondReceivedQty += totalReceiveQty;
                        diamondReceivedPieces += receivedPieces;
                    } else if (classId === COLOR_STONE_CLASS_ID) {
                        colorStoneQty += inBagQty;
                        colorStonePieces += inBagPieces;
                        colorStoneReceivedQty += totalReceiveQty;
                        colorStoneReceivedPieces += receivedPieces;
                    }
                });
                console.log("materialSummary - Totals: goldQty=", goldQty, "diamondQty=", diamondQty, "colorStoneQty=", colorStoneQty);
            } else {
                console.log("materialSummary - No materials available");
            }

            const totalQty = goldQty + (diamondQty * 0.2) + (colorStoneQty * 0.2);
            const totalPieces = goldPieces + diamondPieces + colorStonePieces;
            // For Gross Received Quantity, apply conversion: NWT + (DWT × 0.2) + (CSWT × 0.2)
            const totalReceivedQty = goldReceivedQty + (diamondReceivedQty * 0.2) + (colorStoneReceivedQty * 0.2);
            const totalReceivedPieces = goldReceivedPieces + diamondReceivedPieces + colorStoneReceivedPieces;

            return {
                goldQty,
                goldPieces,
                diamondQty,
                diamondPieces,
                colorStoneQty,
                colorStonePieces,
                totalQty,
                totalPieces,
                goldReceivedQty,
                goldReceivedPieces,
                diamondReceivedQty,
                diamondReceivedPieces,
                colorStoneReceivedQty,
                colorStoneReceivedPieces,
                totalReceivedQty,
                totalReceivedPieces
            };
        });

        // Computed property to calculate weights for each bag
        const bagWeights = computed(() => {
            const weights = {};
            
            if (allBagMaterials.value && Array.isArray(allBagMaterials.value)) {
                allBagMaterials.value.forEach(item => {
                    const bagId = item.bag_no?.value;
                    if (!bagId) return;
                    
                    if (!weights[bagId]) {
                        weights[bagId] = {
                            goldWeight: 0,
                            diamondWeight: 0,
                            colorStoneWeight: 0
                        };
                    }
                    
                    const classId = Number(item.item_class?.value || 0);
                    const totalReceiveQty = Number(item.total_receive?.value || 0);
                    
                    const GOLD_CLASS_IDS = Array.isArray(ENV_VAR.CONSTANTS.CLASS_GOLD) 
                        ? ENV_VAR.CONSTANTS.CLASS_GOLD 
                        : (ENV_VAR.CONSTANTS.CLASS_GOLD || "")
                            .split(",")
                            .map(v => Number(v.trim()))
                            .filter(v => !isNaN(v));
                    const DIAMOND_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_DIAMOND || 0);
                    const COLOR_STONE_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_COLOR_STONE || 0);
                    
                    if (GOLD_CLASS_IDS.includes(classId)) {
                        weights[bagId].goldWeight += totalReceiveQty;
                    } else if (classId === DIAMOND_CLASS_ID) {
                        weights[bagId].diamondWeight += totalReceiveQty;
                    } else if (classId === COLOR_STONE_CLASS_ID) {
                        weights[bagId].colorStoneWeight += totalReceiveQty;
                    }
                });
            }
            
            return weights;
        });

        // Helper function to get weights for a specific bag
        const getBagWeights = (bagId) => {
            const weights = bagWeights.value[bagId] || {
                goldWeight: 0,
                diamondWeight: 0,
                colorStoneWeight: 0
            };
            
            return {
                nwt: Number(weights.goldWeight).toFixed(3),
                dwt: Number(weights.diamondWeight).toFixed(3),
                cswt: Number(weights.colorStoneWeight).toFixed(3),
                gwt: (Number(weights.goldWeight) + (Number(weights.diamondWeight) * 0.2) + (Number(weights.colorStoneWeight) * 0.2)).toFixed(3)
            };
        };

        // Computed property to build Quality & Color Summary table data
        const qualityColorSummary = computed(() => {
            const summary = [];
            
            if (!allBagMaterials.value || allBagMaterials.value.length === 0) {
                return summary;
            }

            // Get class IDs for filtering
            const GOLD_CLASS_IDS = Array.isArray(ENV_VAR.CONSTANTS.CLASS_GOLD) 
                ? ENV_VAR.CONSTANTS.CLASS_GOLD 
                : (ENV_VAR.CONSTANTS.CLASS_GOLD || "")
                    .split(",")
                    .map(v => Number(v.trim()))
                    .filter(v => !isNaN(v));
            const DIAMOND_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_DIAMOND || 0);
            const COLOR_STONE_CLASS_ID = Number(ENV_VAR.CONSTANTS.CLASS_COLOR_STONE || 0);

            // Build a map of quality|color combinations with their aggregated data
            const combinationMap = {};

            allBagMaterials.value.forEach(item => {
                // Get the bag ID from the item
                const bagId = item.bag_no?.value || item.bag_no;
                
                // IMPORTANT: Use ONLY Assembly Item quality (from backend), NOT individual component quality
                // Each bag should have exactly ONE quality from its Assembly Item
                // If Assembly Item quality is not available, skip this material
                let quality = null;
                let color = null;
                
                // ONLY use Assembly Item quality - do NOT fall back to component quality
                if (bagAssemblyQualityColorMap.value && bagAssemblyQualityColorMap.value[bagId]) {
                    quality = bagAssemblyQualityColorMap.value[bagId].quality?.text || bagAssemblyQualityColorMap.value[bagId].quality?.value;
                    color = bagAssemblyQualityColorMap.value[bagId].color?.text || bagAssemblyQualityColorMap.value[bagId].color?.value;
                }
                
                // Only process items with both quality and color from Assembly Item
                // If Assembly Item quality/color is not available, skip this material
                if (!quality || !color) {
                    return;
                }

                const key = `${quality}|${color}`;
                
                if (!combinationMap[key]) {
                    combinationMap[key] = {
                        quality,
                        color,
                        goldQty: 0,
                        goldPieces: 0,
                        diamondQty: 0,
                        diamondPieces: 0,
                        colorStoneQty: 0,
                        colorStonePieces: 0,
                        goldReceivedQty: 0,
                        goldReceivedPieces: 0,
                        diamondReceivedQty: 0,
                        diamondReceivedPieces: 0,
                        colorStoneReceivedQty: 0,
                        colorStoneReceivedPieces: 0
                    };
                }

                const classId = Number(item.item_class?.value || 0);
                
                // In Bag quantities
                const actualQty = Number(item.Quantity?.value || 0);
                const toIssueQty = Number(item.to_issue?.value || 0);
                const inBagQty = actualQty - toIssueQty;
                
                // In Bag pieces
                const actualPiecesInfo = Number(item.actual_pieces_info?.value || 0);
                const toBeIssuedPiecesInfo = Number(item.to_be_issued_pieces_info?.value || 0);
                const inBagPieces = actualPiecesInfo - toBeIssuedPiecesInfo;
                
                // Received quantities and pieces
                const totalReceiveQty = Number(item.total_receive?.value || 0);
                const receivedPieces = Number(item.received_pieces_info?.value || 0);

                // Aggregate by material type
                if (GOLD_CLASS_IDS.includes(classId)) {
                    combinationMap[key].goldQty += inBagQty;
                    combinationMap[key].goldPieces += inBagPieces;
                    combinationMap[key].goldReceivedQty += totalReceiveQty;
                    combinationMap[key].goldReceivedPieces += receivedPieces;
                } else if (classId === DIAMOND_CLASS_ID) {
                    combinationMap[key].diamondQty += inBagQty;
                    combinationMap[key].diamondPieces += inBagPieces;
                    combinationMap[key].diamondReceivedQty += totalReceiveQty;
                    combinationMap[key].diamondReceivedPieces += receivedPieces;
                } else if (classId === COLOR_STONE_CLASS_ID) {
                    combinationMap[key].colorStoneQty += inBagQty;
                    combinationMap[key].colorStonePieces += inBagPieces;
                    combinationMap[key].colorStoneReceivedQty += totalReceiveQty;
                    combinationMap[key].colorStoneReceivedPieces += receivedPieces;
                }
            });

            // Convert map to array and sort by quality then color
            const combinations = Object.values(combinationMap).sort((a, b) => {
                // Handle null/undefined values
                const qualityA = a.quality || '';
                const qualityB = b.quality || '';
                const colorA = a.color || '';
                const colorB = b.color || '';
                
                if (qualityA !== qualityB) {
                    return qualityA.localeCompare(qualityB);
                }
                return colorA.localeCompare(colorB);
            });

            // Build the summary array with material rows for each combination
            combinations.forEach((combo, comboIdx) => {
                const materials = [
                    { type: 'Gold', qty: combo.goldQty, pieces: combo.goldPieces, receivedQty: combo.goldReceivedQty, receivedPieces: combo.goldReceivedPieces, unit: 'gm' },
                    { type: 'Diamond', qty: combo.diamondQty, pieces: combo.diamondPieces, receivedQty: combo.diamondReceivedQty, receivedPieces: combo.diamondReceivedPieces, unit: 'ct' },
                    { type: 'Color Stone', qty: combo.colorStoneQty, pieces: combo.colorStonePieces, receivedQty: combo.colorStoneReceivedQty, receivedPieces: combo.colorStoneReceivedPieces, unit: 'ct' }
                ];

                // Add Gross row
                const grossQty = combo.goldQty + (combo.diamondQty * 0.2) + (combo.colorStoneQty * 0.2);
                const grossReceivedQty = combo.goldReceivedQty + (combo.diamondReceivedQty * 0.2) + (combo.colorStoneReceivedQty * 0.2);
                const grossPieces = combo.goldPieces + combo.diamondPieces + combo.colorStonePieces;
                const grossReceivedPieces = combo.goldReceivedPieces + combo.diamondReceivedPieces + combo.colorStoneReceivedPieces;

                materials.push({ type: 'Gross', qty: grossQty, pieces: grossPieces, receivedQty: grossReceivedQty, receivedPieces: grossReceivedPieces, unit: 'gm' });

                materials.forEach((material, matIdx) => {
                    summary.push({
                        quality: combo.quality,
                        color: combo.color,
                        material: material.type,
                        unit: material.unit,
                        qty: material.qty,
                        pieces: material.pieces,
                        receivedQty: material.receivedQty,
                        receivedPieces: material.receivedPieces,
                        showQualityCell: matIdx === 0,
                        showColorCell: matIdx === 0,
                        qualityRowspan: materials.length,
                        colorRowspan: materials.length
                    });
                });
            });

            return summary;
        });

        const columnTotals = computed(() => {
            return specificMaterialDetailsList.value.reduce((acc, item) => {
                acc.quantity += Number(item.quantity || 0);
                acc.totalIssue += Number(item.totalIssue || 0);
                acc.toIssue += Number(item.toIssue || 0);
                acc.quantityInBag += Number(item.quantityInBag || 0);
                acc.totalReceive += Number(item.totalReceive || 0);
                acc.totalLossQty += Number(item.totalLossQty || 0);
                acc.balanceQty += Number(item.balanceQty || 0);

                acc.pieces += Number(item.pieces || 0);
                acc.piecesIssued += Number(item.piecesIssued || 0);
                acc.piecesToIssue += Number(item.piecesToIssue || 0);
                acc.piecesInBag += Number(item.piecesInBag || 0);
                acc.piecesReceived += Number(item.piecesReceived || 0);
                acc.piecesLoss += Number(item.piecesLoss || 0);
                acc.balancepieces += Number(item.balancepieces || 0);

                return acc;
            }, {
                quantity: 0,
                totalIssue: 0,
                toIssue: 0,
                quantityInBag: 0,
                totalReceive: 0,
                totalLossQty: 0,
                balanceQty: 0,
                pieces: 0,
                piecesIssued: 0,
                piecesToIssue: 0,
                piecesInBag: 0,
                piecesReceived: 0,
                piecesLoss: 0,
                balancepieces: 0
            });
        });

        const getCardColor = (duedateValue) => {
            if (!duedateValue) {
                return "bg-gray-200"; // Default color for missing dates
            }

            const currentDate = new Date();
            const dueDate = new Date(duedateValue);

            console.log("currentDate and due date", { currentDate: currentDate.toDateString(), dueDate: dueDate.toDateString() });

            if (currentDate.toDateString() === dueDate.toDateString()) {
                return "bg-blue-200 border-violet-400"; // Current date == duedate

            } else if (currentDate > dueDate) {
                return "bg-red-200 border-red-400"; // Current date < duedate
            } else {
                return "bg-green-200 border-green-400"; // Current date > duedate
            }
        };

        const changePage = (page) => {
            currentPage.value = page;
            changePageIndex.value = !changePageIndex.value;
            filterResults();
        };

        // Multi-select department methods
        const toggleDepartment = (deptId) => {
            if (selectedDepartment.value.includes(deptId)) {
                // Remove if already selected
                selectedDepartment.value = selectedDepartment.value.filter(id => id !== deptId);
            } else {
                // Add if not selected and max 3 not reached
                if (selectedDepartment.value.length < 3) {
                    selectedDepartment.value.push(deptId);
                } else {
                    toast.warning("Maximum 3 departments can be selected", { position: "top" });
                }
            }
            filterResults();
        };

        const removeDepartment = (deptId) => {
            selectedDepartment.value = selectedDepartment.value.filter(id => id !== deptId);
            filterResults();
        };

        const triggerFetchOverdueBags = useDebounceFn(() => {
            if (!overdueDays.value) {
                overdueDays.value = 0;
            }
            if (previousOverdueDays.value != overdueDays.value) {
                previousOverdueDays.value = overdueDays.value;
                changePage(1);
            }
            // fetchActiveBagsForOverdue();
        }, 500);

        const handleSearchInput = useDebounceFn((params) => {
            if (params) {
                changePage(1);
            } else if (searchTerm.value?.length > 2) {
                previousSearchTerm.value = searchTerm.value;
                changePage(1);
            } else if (previousSearchTerm.value?.length > 2) {
                previousSearchTerm.value = "";
                changePage(1);
                toast.info("Search term must be at least 3 characters long.", {
                    position: "top",
                });
            } else {
                toast.info("Search term must be at least 3 characters long.", {
                    position: "top",
                });
            }
        }, 800);

        const filterResults = () => {
            console.log("In filterResults");
            if (!changePageIndex.value) {
                currentPage.value = 1; // Reset to first page
            } else {
                changePageIndex.value = false;
            }

            if (selectedSidebar.value?.value === 'bag_details') {
                const department = selectedDepartment.value;
                const searchId = searchTerm.value?.toLowerCase()?.trim();
                console.log("selectedTab.value", selectedTab.value);
                console.log("searchId", searchId);
                if (selectedTab.value?.value === "bags_to_move") {
                    // paginatedResults.value = bagToMoveList.value?.filter((bag) => {
                    //     const matchesDepartment = department ? bag.department?.value === department : true;
                    //     const matchesBagId =
                    //         !searchId || bag.bag_no?.text?.toLowerCase().includes(searchId);
                    //     return matchesDepartment && matchesBagId;
                    // });
                    fetchBagToMove();
                } else if (selectedTab.value?.value === "bags_to_acknowledge") {
                    // paginatedResults.value = bagsToAcknowledgeList.value?.filter((bag) => {
                    //     const matchesDepartment = department ? bag.to_department?.value === department : true;
                    //     const matchesBagId =
                    //         !searchId || bag.bag_no?.value?.toLowerCase().includes(searchId);
                    //     return matchesDepartment && matchesBagId;
                    // });
                    fetchBagsToAcknowledge();
                } else if (selectedTab.value?.value === "bags_rejected") {
                    // paginatedResults.value = bagsRejectedList.value?.filter((bag) => {
                    //     const matchesDepartment = department ? bag.department?.value === department : true;
                    //     const matchesBagId =
                    //         !searchId || bag.bag_no_name?.value?.toLowerCase().includes(searchId);
                    //     return matchesDepartment && matchesBagId;
                    // });
                    fetchRejectedBags();
                } else if (selectedTab.value?.value === "bags_overdue") {
                    // paginatedResults.value = bagsOverdueList.value?.filter((bag) => {
                    //     const matchesDepartment = department ? bag.department?.value === department : true;
                    //     const matchesBagId =
                    //         !searchId || bag.bag_no_name?.value?.toLowerCase().includes(searchId);
                    //     return matchesDepartment && matchesBagId;
                    // });
                    fetchOverdueBags();
                } else {
                    // paginatedResults.value = bags.value?.filter((bag) => {
                    //     const matchesDepartment = department ? bag.department?.value === department : true;
                    //     const matchesBagId =
                    //         !searchId || bag.bag_no_name?.value?.toLowerCase()?.trim().includes(searchId);
                    //     const matchWorkOrder = !searchId || bag.work_order_id?.text?.toLowerCase()?.trim().includes(searchId);
                    //     return matchesDepartment && (matchesBagId || matchWorkOrder);
                    // });
                    processEmployees();
                    fetchActiveBags();
                }

                // noResultsFound.value = paginatedResults.value?.length === 0;
                // totalItems.value = paginatedResults.value?.length;
            } else if (selectedSidebar.value?.value === 'gold_type' || selectedSidebar.value?.value === 'diamond_type' || selectedSidebar.value?.value === 'color_stone_type') {
                fetchSpecificMaterialDetails();
            } else if (selectedSidebar.value?.value === 'material_overdue_details') {
                fetchActiveBagsForOverdue();
            }
        };

        const fetchDepartments = async () => {
            try {
                const payload = { all_department: isAdmin.value, user_id: userId.value, params: 'user_specific' };
                await fetchListDepartments(payload); // Fetch departments via API
                if (listDepartments.value?.length > 0) {
                    departments.value = listDepartments.value;
                } else {
                    toast.warning("No departments found.", { position: "top" });
                }
            } catch (err) {
                toast.error(err.message || "Failed to fetch departments", { position: "top" });
            }
        };

        const fetchActiveBags = async () => {
            try {
                console.log("=== fetchActiveBags START ===");
                loadingBags.value = true;
                resetVariables();
                const formattedDate = selectedDate.value
                    ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                    : null;
                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    // params: "bag_summary_active_bags",
                    params: "active_bags",
                    page_size: itemsPerPage.value,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    date: formattedDate,
                    employee: selectedEmployee.value
                    // all_department: userStore.isAdmin || false,
                };
                // const payload = { depatemnt_id: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], all_department: true };
                await fetchListActiveBags(payload); // Fetch bags for the department
                console.log("listActiveBags", listActiveBags.value?.bagList);
                console.log(listActiveBags.value?.totalItems);

                if (selectedTab.value?.value == "active_bags") {
                    console.log("selectedTab is active_bags");
                    if (listActiveBags.value?.totalItems > 0) {
                        console.log("totalItems > 0, setting bags and calling calculateGoldWeightForDisplayedBags");
                        bags.value = listActiveBags.value?.bagList;
                        totalItems.value = listActiveBags.value?.totalItems;
                        noResultsFound.value = false;

                        // Load bag cards first, then load weights and materials in background
                        calculateGoldWeightForDisplayedBags();
                        fetchAllBagMaterials();
                        fetchQualityColorFromBags();
                    } else {
                        console.log("totalItems <= 0, resetting");
                        bags.value = []; // Clear bags if no results
                        totalItems.value = 0;
                        noResultsFound.value = true; // Display no results message
                        localTotalGoldWeight.value = 0;
                        localTotalDiamondWeight.value = 0;
                        localTotalColorStoneWeight.value = 0;
                        allBagMaterials.value = [];
                    }
                }

                console.log("bags", bags.value);
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags", { position: "top" });
            }
            loadingBags.value = false;
        };

        const calculateGoldWeightForDisplayedBags = async (bagListToUse = null) => {
            try {
                console.log("=== calculateGoldWeightForDisplayedBags START ===");
                // Clear old material data to show skeleton animation while loading
                allBagMaterials.value = [];
                localTotalGoldWeight.value = 0;
                localTotalDiamondWeight.value = 0;
                localTotalColorStoneWeight.value = 0;
                console.log("Reset localTotalGoldWeight, localTotalDiamondWeight, and localTotalColorStoneWeight to 0");

                // Determine which bag list to use based on current tab
                let currentBagList = bagListToUse;
                let allBagIds = [];

                if (!currentBagList) {
                    // For active_bags tab, fetch all bags without pagination to get all IDs
                    if (selectedTab.value?.value === "active_bags") {
                        const formattedDate = selectedDate.value
                            ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                            : null;
                        const payload = {
                            page_index: null, // Fetch all without pagination
                            bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                            // params: "bag_summary_active_bags",
                            params: "active_bags",
                            page_size: 1000,
                            department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                            date: formattedDate,
                            employee: selectedEmployee.value
                        };
                        await fetchListActiveBags(payload);
                        // Handle both array and object responses
                        currentBagList = Array.isArray(listActiveBags.value) ? listActiveBags.value : (listActiveBags.value?.bagList || []);
                    } else if (selectedTab.value?.value === "bags_to_move") {
                        const payload = {
                            page_index: null, // Fetch all without pagination
                            bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                            page_size: 1000,
                            from_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                            params: 'bag_movement'
                        };
                        await fetchListBagToMove(payload);
                        // Handle both array and object responses
                        currentBagList = Array.isArray(bagToMoveListObj.value) ? bagToMoveListObj.value : (bagToMoveListObj.value?.bagList || []);
                    } else if (selectedTab.value?.value === "bags_to_acknowledge") {
                        const payload = {
                            page_index: null, // Fetch all without pagination
                            bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                            page_size: 1000,
                            to_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                            params: 'bag_acknowledgement'
                        };
                        await fetchListBagsToAcknowledge(payload);
                        // Handle both array and object responses
                        currentBagList = Array.isArray(bagsToAcknowledgeListobj.value) ? bagsToAcknowledgeListobj.value : (bagsToAcknowledgeListobj.value?.bagList || []);
                    } else if (selectedTab.value?.value === "bags_rejected") {
                        const payload = {
                            page_index: null, // Fetch all without pagination
                            bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                            page_size: 1000,
                            department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                            params: 'bags_rejected'
                        };
                        await fetchListRejectedBags(payload);
                        // Handle both array and object responses
                        currentBagList = Array.isArray(bagsRejectedListObj.value) ? bagsRejectedListObj.value : (bagsRejectedListObj.value?.bagList || []);
                    } else if (selectedTab.value?.value === "bags_overdue") {
                        const payload = {
                            page_index: null, // Fetch all without pagination
                            bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                            page_size: 1000,
                            department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                            params: 'bags_overdue'
                        };
                        await fetchListOverdueBags(payload);
                        // Handle both array and object responses
                        currentBagList = Array.isArray(bagsOverdueListObj.value) ? bagsOverdueListObj.value : (bagsOverdueListObj.value?.bagList || []);
                    }
                }

                if (!currentBagList || currentBagList.length === 0) {
                    console.log("No bags to calculate weight for");
                    return;
                }

                console.log("currentBagList.length:", currentBagList.length);

                // Get bag IDs for ALL bags in the tab (not just current page)
                // Different tabs use different property names for bag IDs
                const bagIdList = currentBagList.map(bag => {
                    // Try different property names based on tab
                    return bag.bag_no_id?.value || bag.bag_no?.value || bag.operation_id?.value;
                }).filter(id => id);
                console.log("bagIdList (all bags in tab):", bagIdList);

                if (bagIdList.length === 0) {
                    console.log("No bag IDs found");
                    return;
                }

                // Call the backend to calculate total material weights for ALL bags in tab
                console.log("Calling getTotalMaterialWeights with bagIdList:", bagIdList);
                await getTotalMaterialWeights({ 
                    bag_ids: bagIdList,
                    params: "calculate_all_bags_weight"
                });
                // Update local refs with the values from composable
                console.log("After getTotalMaterialWeights, totalMaterialWeights.value:", totalMaterialWeights.value);
                localTotalGoldWeight.value = totalMaterialWeights.value.goldWeight;
                localTotalDiamondWeight.value = totalMaterialWeights.value.diamondWeight;
                localTotalColorStoneWeight.value = totalMaterialWeights.value.colorStoneWeight;
                console.log("Updated local weight values:", {
                    gold: localTotalGoldWeight.value,
                    diamond: localTotalDiamondWeight.value,
                    colorStone: localTotalColorStoneWeight.value
                });
                console.log("=== calculateGoldWeightForDisplayedBags END ===");
            } catch (err) {
                console.error("Error calculating weights for displayed bags:", err);
                localTotalGoldWeight.value = 0;
                localTotalDiamondWeight.value = 0;
                localTotalColorStoneWeight.value = 0;
            }
        };

        const fetchActiveBagsForOverdue = async () => {
            try {
                loadingBags.value = true;
                resetVariables();
                timestamp.value = new Date().getTime();

                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    params: "active_bags_for_overdue",
                    page_size: itemsPerPage.value,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    overdue_days: overdueDays.value,
                    timestamp: timestamp.value,
                    // all_department: userStore.isAdmin || false,
                };
                // const payload = { depatemnt_id: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], all_department: true };
                await fetchListActiveBags(payload); // Fetch bags for the department
                console.log(listActiveBags.value?.bagList);
                console.log(listActiveBags.value?.totalItems);

                if (listActiveBags.value?.totalItems > 0 && listActiveBags.value?.timestamp === timestamp.value) {
                    bags.value = listActiveBags.value?.bagList;
                    totalItems.value = listActiveBags.value?.totalItems;
                    noResultsFound.value = false;
                }

                console.log("bags", bags.value);
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags", { position: "top" });
            }
            loadingBags.value = false;
        };

        const openBagDetails = async (bag) => {
            selectedBagId.value = bag.bag_no_id?.value;
            selectedBagName.value = bag.bag_no_name?.value;
            showMaterialDetailsPopUp.value = true;
            console.log("selectedBagId", selectedBagId.value);
            console.log("selectedBagName", selectedBagName.value);
        };

        const closeBagDetails = () => {
            showMaterialDetailsPopUp.value = false;
            selectedBagId.value = "";
            selectedBagName.value = "";
        };

        const fetchBagToMove = async () => {
            try {
                loadingBags.value = true;
                resetVariables();
                // Fetch bags to move
                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    page_size: shortItemsPerPage.value,
                    from_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    // all_department: userStore.isAdmin || false,
                    params: 'bag_movement'
                };

                await fetchListBagToMove(payload);
                console.log("bagToMoveList", bagToMoveListObj.value);
                if (selectedTab.value?.value == "bags_to_move") {
                    if (bagToMoveListObj.value?.totalItems > 0) {
                        bagToMoveList.value = bagToMoveListObj.value?.bagList;
                        totalItems.value = bagToMoveListObj.value?.totalItems;
                        noResultsFound.value = false;
                        // Load bag cards first, then load weights and materials in background
                        calculateGoldWeightForDisplayedBags();
                        fetchAllBagMaterials();
                        fetchQualityColorFromBags();
                    } else {
                        bagToMoveList.value = []; // Clear bags if no results
                        totalItems.value = 0;
                        noResultsFound.value = true; // Display no results message
                        localTotalGoldWeight.value = 0;
                        localTotalDiamondWeight.value = 0;
                        localTotalColorStoneWeight.value = 0;
                        allBagMaterials.value = [];
                    }
                }
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags to move", { position: "top" });
            }
            loadingBags.value = false;
        };

        const fetchBagsToAcknowledge = async () => {
            try {
                loadingBags.value = true;
                resetVariables();
                // Fetch bags to move
                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    page_size: shortItemsPerPage.value,
                    to_department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    // all_department: userStore.isAdmin || false,
                    params: 'bag_acknowledgement'
                };
                await fetchListBagsToAcknowledge(payload);
                console.log("bagsToAcknowledgeList", bagsToAcknowledgeListobj.value);

                if (selectedTab.value?.value == "bags_to_acknowledge") {
                    if (bagsToAcknowledgeListobj.value?.totalItems > 0) {
                        bagsToAcknowledgeList.value = bagsToAcknowledgeListobj.value?.bagList;
                        totalItems.value = bagsToAcknowledgeListobj.value?.totalItems;
                        noResultsFound.value = false;
                        // Load bag cards first, then load weights and materials in background
                        calculateGoldWeightForDisplayedBags();
                        fetchAllBagMaterials();
                        fetchQualityColorFromBags();
                    } else {
                        bagsToAcknowledgeList.value.length = 0; // Clear bags if no results
                        totalItems.value = 0;
                        noResultsFound.value = true; // Display no results message
                        localTotalGoldWeight.value = 0;
                        localTotalDiamondWeight.value = 0;
                        localTotalColorStoneWeight.value = 0;
                        allBagMaterials.value = [];
                    }
                }
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags to acknowledgeList", { position: "top" });
            }
            loadingBags.value = false;
        };

        const fetchRejectedBags = async () => {
            try {
                loadingBags.value = true;
                resetVariables();
                // console.log("isAdmin.value == false ? selectedDepartment.value: ''", isAdmin.value == false ? selectedDepartment.value: '')
                // Fetch bags to move
                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    page_size: shortItemsPerPage.value,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    // all_department: userStore.isAdmin,
                    params: 'bags_rejected'
                };
                console.log("bags_rejected payload", payload);
                await fetchListRejectedBags(payload);
                console.log("bagsRejectedList", bagsRejectedListObj.value);

                if (selectedTab.value?.value == "bags_rejected") {
                    if (bagsRejectedListObj.value?.totalItems > 0) {
                        bagsRejectedList.value = bagsRejectedListObj.value?.bagList;
                        totalItems.value = bagsRejectedListObj.value?.totalItems;
                        noResultsFound.value = false;
                        // Load bag cards first, then load weights and materials in background
                        calculateGoldWeightForDisplayedBags();
                        fetchAllBagMaterials();
                        fetchQualityColorFromBags();
                    } else {
                        bagsRejectedList.value.length = 0; // Clear bags if no results
                        totalItems.value = 0;
                        noResultsFound.value = true; // Display no results message
                        localTotalGoldWeight.value = 0;
                        localTotalDiamondWeight.value = 0;
                        localTotalColorStoneWeight.value = 0;
                        allBagMaterials.value = [];
                    }
                }
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags to acknowledgeList", { position: "top" });
            }
            loadingBags.value = false;
        };

        const fetchOverdueBags = async () => {
            try {
                loadingBags.value = true;
                resetVariables();
                // Fetch overdue bags
                const payload = {
                    page_index: currentPage.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    page_size: shortItemsPerPage.value,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    params: 'bags_overdue'
                };
                await fetchListOverdueBags(payload);
                console.log("bagsOverdueList", bagsOverdueListObj.value);

                if (selectedTab.value?.value == "bags_overdue") {
                    if (bagsOverdueListObj.value?.totalItems > 0) {
                        bagsOverdueList.value = bagsOverdueListObj.value?.bagList;
                        totalItems.value = bagsOverdueListObj.value?.totalItems;
                        noResultsFound.value = false;
                        // Load bag cards first, then load weights and materials in background
                        calculateGoldWeightForDisplayedBags();
                        fetchAllBagMaterials();
                        fetchQualityColorFromBags();
                    } else {
                        bagsOverdueList.value.length = 0; // Clear bags if no results
                        totalItems.value = 0;
                        noResultsFound.value = true; // Display no results message
                        localTotalGoldWeight.value = 0;
                        localTotalDiamondWeight.value = 0;
                        localTotalColorStoneWeight.value = 0;
                        allBagMaterials.value = [];
                    }
                }
            } catch (err) {
                toast.error(err.message || "Failed to fetch bags to acknowledgeList", { position: "top" });
            }
            loadingBags.value = false;
        };

        const fetchSpecificMaterialDetails = async () => {
            try {
                loadingMaterialDetails.value = true;
                resetVariables();
                specificMaterialDetailsList.value.length = 0;
                // Fetch bags to move
                const payload = {
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    material_type: selectedSidebar.value?.value,
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                };
                await fetchListSpecificMaterialDetails(payload);
                console.log("specificMaterialDetailsList", specificMaterialDetailsList.value);
            } catch (err) {
                toast.error(err.message || "Failed to fetch Metal Details", { position: "top" });
            }
            loadingMaterialDetails.value = false;
        };

        const printFilteredBags = async () => {
            try {
                const formattedDate = selectedDate.value
                    ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                    : null;
                const payload = {
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    params: "bag_print_all",
                    page_size: itemsPerPage.value,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    date: formattedDate,
                    employee: selectedEmployee.value,
                    selectedBags: selectedBags.value   // <-- NEW
                    // all_department: userStore.isAdmin || false,
                };

                console.log("printFilteredBags payload", payload);
                await generatePDFWithInternalId(payload);
                console.log("PDF generated successfully!");
            } catch {
                console.error("Error generating PDF:", error.value);
            }
        };

        const printPDF = async (bagId) => {
            try {
                console.log("bagId", bagId);
                const payload = {
                    bag_id: bagId,
                    params: "bag_print",
                };
                await generatePDFWithInternalId(payload);
                console.log("PDF generated successfully!");
            } catch {
                console.error("Error generating PDF:", error.value);
            }
        };

        // // Open Popup & Set Image
        // const openPopup = (bagImage, bagImageIds) => {
        //     setTimeout(() => {
        //         imageUrl.value = bagImage;
        //         isPopupOpen.value = true;
        //         bagImageId.value = bagImageIds;
        //     }, 200);
        // };

        // // Close Popup
        // const closePopup = () => {
        //     imageUrl.value = "";
        //     isPopupOpen.value = false;
        // };

        // Close popup when ESC key is pressed
        const handleKeyPress = (event) => {
            if (event.key === "Escape") {
                handleImageClose();
            }
        };

        // const fetchEmployees = async () => {
        //     try {
        //         const payload = { is_hod: false };
        //         await fetchlistEmployees(payload); // Fetch employees via API
        //         if (listEmployees.value.length > 0) {
        //             regularEmployees.value = listEmployees.value;
        //         } else {
        //             toast.warning("No employees found.", { position: "top" });
        //         }
        //     } catch (err) {
        //         toast.error(err.message || "Failed to fetch employees", { position: "top" });
        //     }
        // };

        const printAllBagsData = async () => {
            try {
                const formattedDate = selectedDate.value
                    ? dayjs(selectedDate.value).format('YYYY-MM-DD')
                    : null;
                const payload = {
                    bag_search_key: previousSearchTerm.value?.toLowerCase().trimStart() || "",
                    params: "bag_print_all_data",
                    page_size: null,
                    department_id: selectedDepartment.value || departments.value?.map((dept) => dept.value),
                    date: formattedDate,
                    employee: selectedEmployee.value
                    // all_department: userStore.isAdmin || false,
                };
                await getAllBagData(payload);
                console.log("allBagData", allBagData.value);
                await downloadAllBagsExcel();
                console.log("All filtered bags data downloaded successfully!");
            } catch {
                console.error("Error generating PDF:", error.value);
            }
        };

        // const downloadAllBagsExcel = async () => {
        //     try {
        //         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        //         const workbook = new ExcelJS.Workbook();
        //         const sheet = workbook.addWorksheet('ALL BAG DATA');

        //         const grayFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } };
        //         const blueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };
        //         const boldFont = { bold: true };
        //         const headingFont = { bold: true, size: 16 };
        //         const centerAlign = { vertical: 'middle', horizontal: 'center' };

        //         const headers = [
        //             "Department", "Bag", "Material", "Item Name", "Qty", "To Issue", "In Bag", "Issued", "Received",
        //             "Balance Qty", "Loss Qty", "Pcs", "Pcs Issued", "Pcs To Issue", "Pcs In Bag",
        //             "Pcs Received", "Balance Pcs", "Pcs Loss"
        //         ];

        //         let currentRow = 1;
        //         const deptMaterialTotals = [];
        //         const deptMergeRanges = [];
        //         const bagMergeRanges = [];

        //         // Main Heading
        //         const mainHeading = sheet.addRow(["ALL BAG DETAILS REPORT"]);
        //         sheet.mergeCells(`A${currentRow}:R${currentRow}`);
        //         mainHeading.font = headingFont;
        //         mainHeading.alignment = centerAlign;
        //         mainHeading.fill = blueFill;
        //         currentRow++;

        //         // Headers
        //         const headerRow = sheet.addRow(headers);
        //         headerRow.font = boldFont;
        //         headerRow.alignment = centerAlign;
        //         headerRow.fill = grayFill;
        //         currentRow++;

        //         allBagData.value.forEach((department) => {
        //             let deptStartRow = null;
        //             let deptEndRow = null;

        //             department.bags.forEach((bag) => {
        //                 let bagStartRow = null;
        //                 let bagEndRow = null;
        //                 let materialItemCount = 0;

        //                 ['gold', 'diamond', 'colorStone'].forEach((materialKey) => {
        //                     const material = bag.materials[materialKey];
        //                     if (!material || !material.items || material.items.length === 0) return;

        //                     let deptMaterialTotal = deptMaterialTotals.find(x => x.department === department.departmentName && x.material === materialKey);
        //                     if (!deptMaterialTotal) {
        //                         deptMaterialTotal = {
        //                             department: department.departmentName,
        //                             material: materialKey,
        //                             qty: 0, toIssue: 0, inBag: 0, issued: 0, received: 0,
        //                             balQty: 0, lossQty: 0, pcs: 0, pcsIssued: 0, pcsToIssue: 0,
        //                             pcsInBag: 0, pcsReceived: 0, balPcs: 0, pcsLoss: 0
        //                         };
        //                         deptMaterialTotals.push(deptMaterialTotal);
        //                     }

        //                     const materialBagTotals = {
        //                         qty: 0, toIssue: 0, inBag: 0, issued: 0, received: 0,
        //                         balQty: 0, lossQty: 0, pcs: 0, pcsIssued: 0, pcsToIssue: 0,
        //                         pcsInBag: 0, pcsReceived: 0, balPcs: 0, pcsLoss: 0
        //                     };

        //                     material.items.forEach((item) => {
        //                         const row = sheet.addRow([
        //                             department.departmentName,
        //                             bag.bagName,
        //                             materialKey,
        //                             item.itemName,
        //                             item.quantity,
        //                             item.toIssue,
        //                             item.quantityInBag,
        //                             item.totalIssue,
        //                             item.totalReceive,
        //                             item.balanceQty,
        //                             item.totalLossQty,
        //                             item.pieces,
        //                             item.piecesIssued,
        //                             item.piecesToIssue,
        //                             item.piecesInBag,
        //                             item.piecesReceived,
        //                             item.balancepieces,
        //                             item.piecesLoss
        //                         ]);

        //                         if (!bagStartRow) bagStartRow = row.number;
        //                         bagEndRow = row.number;
        //                         currentRow++;
        //                         materialItemCount++;

        //                         // Totals accumulation
        //                         materialBagTotals.qty += item.quantity;
        //                         materialBagTotals.toIssue += item.toIssue;
        //                         materialBagTotals.inBag += item.quantityInBag;
        //                         materialBagTotals.issued += item.totalIssue;
        //                         materialBagTotals.received += item.totalReceive;
        //                         materialBagTotals.balQty += item.balanceQty;
        //                         materialBagTotals.lossQty += item.totalLossQty;
        //                         materialBagTotals.pcs += item.pieces;
        //                         materialBagTotals.pcsIssued += item.piecesIssued;
        //                         materialBagTotals.pcsToIssue += item.piecesToIssue;
        //                         materialBagTotals.pcsInBag += item.piecesInBag;
        //                         materialBagTotals.pcsReceived += item.piecesReceived;
        //                         materialBagTotals.balPcs += item.balancepieces;
        //                         materialBagTotals.pcsLoss += item.piecesLoss;

        //                         deptMaterialTotal.qty += item.quantity;
        //                         deptMaterialTotal.toIssue += item.toIssue;
        //                         deptMaterialTotal.inBag += item.quantityInBag;
        //                         deptMaterialTotal.issued += item.totalIssue;
        //                         deptMaterialTotal.received += item.totalReceive;
        //                         deptMaterialTotal.balQty += item.balanceQty;
        //                         deptMaterialTotal.lossQty += item.totalLossQty;
        //                         deptMaterialTotal.pcs += item.pieces;
        //                         deptMaterialTotal.pcsIssued += item.piecesIssued;
        //                         deptMaterialTotal.pcsToIssue += item.piecesToIssue;
        //                         deptMaterialTotal.pcsInBag += item.piecesInBag;
        //                         deptMaterialTotal.pcsReceived += item.piecesReceived;
        //                         deptMaterialTotal.balPcs += item.balancepieces;
        //                         deptMaterialTotal.pcsLoss += item.piecesLoss;
        //                     });

        //                     const totalRow = sheet.addRow([
        //                         '', '', `${materialKey.toUpperCase()} TOTAL`, '',
        //                         materialBagTotals.qty, materialBagTotals.toIssue, materialBagTotals.inBag,
        //                         materialBagTotals.issued, materialBagTotals.received, materialBagTotals.balQty,
        //                         materialBagTotals.lossQty, materialBagTotals.pcs, materialBagTotals.pcsIssued,
        //                         materialBagTotals.pcsToIssue, materialBagTotals.pcsInBag, materialBagTotals.pcsReceived,
        //                         materialBagTotals.balPcs, materialBagTotals.pcsLoss
        //                     ]);
        //                     totalRow.font = boldFont;
        //                     totalRow.fill = grayFill;
        //                     bagEndRow = totalRow.number;
        //                     currentRow++;
        //                 });

        //                 if (materialItemCount > 0 && bagStartRow < bagEndRow) {
        //                     bagMergeRanges.push({ start: bagStartRow, end: bagEndRow, col: 2 });
        //                     if (!deptStartRow) deptStartRow = bagStartRow;
        //                     deptEndRow = bagEndRow;
        //                 }
        //             });

        //             if (deptStartRow !== null && deptStartRow < deptEndRow) {
        //                 deptMergeRanges.push({ start: deptStartRow, end: deptEndRow, col: 1 });
        //             }
        //         });

        //         // Apply merges
        //         deptMergeRanges.forEach(({ start, end, col }) => {
        //             if (start < end) sheet.mergeCells(start, col, end, col);
        //         });
        //         bagMergeRanges.forEach(({ start, end, col }) => {
        //             if (start < end) sheet.mergeCells(start, col, end, col);
        //         });

        //         // === Add Grand Totals Section ===
        //         currentRow += 2;
        //         sheet.addRow([]);
        //         const grandHeader = sheet.addRow(["GRAND TOTAL BY DEPARTMENT AND MATERIAL"]);
        //         sheet.mergeCells(`A${currentRow}:R${currentRow}`);
        //         grandHeader.font = headingFont;
        //         grandHeader.alignment = centerAlign;
        //         grandHeader.fill = blueFill;
        //         currentRow++;

        //         const totalHeader = sheet.addRow([
        //             "Department", "Material", "Qty", "To Issue", "In Bag", "Issued", "Received", "Balance Qty", "Loss Qty",
        //             "Pcs", "Pcs Issued", "Pcs To Issue", "Pcs In Bag", "Pcs Received", "Balance Pcs", "Pcs Loss"
        //         ]);
        //         totalHeader.font = boldFont;
        //         totalHeader.fill = grayFill;
        //         currentRow++;

        //         deptMaterialTotals.forEach(total => {
        //             sheet.addRow([
        //                 total.department, total.material.toUpperCase(),
        //                 total.qty, total.toIssue, total.inBag, total.issued, total.received,
        //                 total.balQty, total.lossQty,
        //                 total.pcs, total.pcsIssued, total.pcsToIssue, total.pcsInBag, total.pcsReceived,
        //                 total.balPcs, total.pcsLoss
        //             ]);
        //             currentRow++;
        //         });

        //         // Auto-fit columns
        //         sheet.columns.forEach(col => {
        //             let maxLen = 10;
        //             col.eachCell?.((cell) => {
        //                 const len = String(cell.value || '').length;
        //                 if (len > maxLen) maxLen = len;
        //             });
        //             col.width = maxLen + 2;
        //         });

        //         const buffer = await workbook.xlsx.writeBuffer();
        //         saveAs(
        //             new Blob([buffer], {
        //                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        //             }),
        //             `all_bag_data_${timestamp}.xlsx`
        //         );
        //     } catch (error) {
        //         console.error("Error downloading Excel file:", error);
        //         toast.error("Failed to download Excel file", { position: "top" });
        //     }
        // };

        const downloadAllBagsExcel = async () => {
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('ALL BAG DATA');

                const grayFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } };
                const blueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };
                const blueFillStrong = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFDBFE' } };
                const yellowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };

                const boldFont = { name: 'Calibri', size: 9, bold: true };
                const headingFont = { name: 'Calibri', size: 14, bold: true };
                const centerAlign = { vertical: 'middle', horizontal: 'center', wrapText: true };

                const headers = [
                    "Department", "Bag", "Material", "Item Name", "Qty", "To Issue", "In Bag", "Issued", "Received",
                    "Balance Qty", "Loss Qty", "Pcs", "Pcs Issued", "Pcs To Issue", "Pcs In Bag",
                    "Pcs Received", "Balance Pcs", "Pcs Loss"
                ];

                let currentRow = 2;
                sheet.addRow([]);
                const deptMaterialTotals = [];
                const deptMergeRanges = [];
                const bagMergeRanges = [];

                // Main Heading
                const mainHeading = sheet.addRow(["ALL BAG DETAILS REPORT"]);
                sheet.mergeCells(`A${currentRow}:S${currentRow}`);
                mainHeading.font = headingFont;
                mainHeading.alignment = centerAlign;
                mainHeading.fill = blueFillStrong;
                mainHeading.height = 25;
                currentRow += 2;
                sheet.addRow([]);

                // Headers
                const headerRow = sheet.addRow(headers);
                headerRow.font = boldFont;
                headerRow.alignment = centerAlign;
                headerRow.fill = blueFill;
                headerRow.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });

                currentRow++;

                allBagData.value.forEach((department) => {
                    let deptStartRow = null;
                    let deptEndRow = null;

                    department.bags.forEach((bag) => {
                        let bagStartRow = null;
                        let bagEndRow = null;
                        let materialItemCount = 0;

                        ['gold', 'diamond', 'colorStone'].forEach((materialKey) => {
                            const material = bag.materials[materialKey];
                            if (!material || !material.items || material.items.length === 0) return;

                            let deptMaterialTotal = deptMaterialTotals.find(x => x.department === department.departmentName && x.material === materialKey);
                            if (!deptMaterialTotal) {
                                deptMaterialTotal = {
                                    department: department.departmentName,
                                    material: materialKey,
                                    qty: 0, toIssue: 0, inBag: 0, issued: 0, received: 0,
                                    balQty: 0, lossQty: 0, pcs: 0, pcsIssued: 0, pcsToIssue: 0,
                                    pcsInBag: 0, pcsReceived: 0, balPcs: 0, pcsLoss: 0
                                };
                                deptMaterialTotals.push(deptMaterialTotal);
                            }

                            const materialBagTotals = {
                                qty: 0, toIssue: 0, inBag: 0, issued: 0, received: 0,
                                balQty: 0, lossQty: 0, pcs: 0, pcsIssued: 0, pcsToIssue: 0,
                                pcsInBag: 0, pcsReceived: 0, balPcs: 0, pcsLoss: 0
                            };

                            material.items.forEach((item) => {
                                const row = sheet.addRow([
                                    department.departmentName,
                                    bag.bagName,
                                    materialKey,
                                    item.itemName,
                                    Number(item.quantity.toFixed(4)),
                                    Number(item.toIssue.toFixed(4)),
                                    Number(item.quantityInBag.toFixed(4)),
                                    Number(item.totalIssue.toFixed(4)),
                                    Number(item.totalReceive.toFixed(4)),
                                    Number(item.balanceQty.toFixed(4)),
                                    Number(item.totalLossQty.toFixed(4)),
                                    Number(item.pieces.toFixed(4)),
                                    Number(item.piecesIssued.toFixed(4)),
                                    Number(item.piecesToIssue.toFixed(4)),
                                    Number(item.piecesInBag.toFixed(4)),
                                    Number(item.piecesReceived.toFixed(4)),
                                    Number(item.balancepieces.toFixed(4)),
                                    Number(item.piecesLoss.toFixed(4))
                                ]);

                                row.eachCell({ includeEmpty: true }, cell => {
                                    cell.alignment = centerAlign;
                                    cell.border = {
                                        top: { style: 'thin' },
                                        bottom: { style: 'thin' },
                                        left: { style: 'thin' },
                                        right: { style: 'thin' }
                                    };
                                });

                                if (!bagStartRow) bagStartRow = row.number;
                                bagEndRow = row.number;
                                currentRow++;
                                materialItemCount++;

                                // Totals accumulation
                                materialBagTotals.qty += item.quantity;
                                materialBagTotals.toIssue += item.toIssue;
                                materialBagTotals.inBag += item.quantityInBag;
                                materialBagTotals.issued += item.totalIssue;
                                materialBagTotals.received += item.totalReceive;
                                materialBagTotals.balQty += item.balanceQty;
                                materialBagTotals.lossQty += item.totalLossQty;
                                materialBagTotals.pcs += item.pieces;
                                materialBagTotals.pcsIssued += item.piecesIssued;
                                materialBagTotals.pcsToIssue += item.piecesToIssue;
                                materialBagTotals.pcsInBag += item.piecesInBag;
                                materialBagTotals.pcsReceived += item.piecesReceived;
                                materialBagTotals.balPcs += item.balancepieces;
                                materialBagTotals.pcsLoss += item.piecesLoss;

                                deptMaterialTotal.qty += item.quantity;
                                deptMaterialTotal.toIssue += item.toIssue;
                                deptMaterialTotal.inBag += item.quantityInBag;
                                deptMaterialTotal.issued += item.totalIssue;
                                deptMaterialTotal.received += item.totalReceive;
                                deptMaterialTotal.balQty += item.balanceQty;
                                deptMaterialTotal.lossQty += item.totalLossQty;
                                deptMaterialTotal.pcs += item.pieces;
                                deptMaterialTotal.pcsIssued += item.piecesIssued;
                                deptMaterialTotal.pcsToIssue += item.piecesToIssue;
                                deptMaterialTotal.pcsInBag += item.piecesInBag;
                                deptMaterialTotal.pcsReceived += item.piecesReceived;
                                deptMaterialTotal.balPcs += item.balancepieces;
                                deptMaterialTotal.pcsLoss += item.piecesLoss;
                            });

                            const totalRow = sheet.addRow([
                                '',
                                '',
                                `${materialKey.toUpperCase()} TOTAL`,
                                '',

                                Number(materialBagTotals.qty.toFixed(4)),
                                Number(materialBagTotals.toIssue.toFixed(4)),
                                Number(materialBagTotals.inBag.toFixed(4)),
                                Number(materialBagTotals.issued.toFixed(4)),
                                Number(materialBagTotals.received.toFixed(4)),
                                Number(materialBagTotals.balQty.toFixed(4)),
                                Number(materialBagTotals.lossQty.toFixed(4)),

                                Number(materialBagTotals.pcs.toFixed(4)),
                                Number(materialBagTotals.pcsIssued.toFixed(4)),
                                Number(materialBagTotals.pcsToIssue.toFixed(4)),
                                Number(materialBagTotals.pcsInBag.toFixed(4)),
                                Number(materialBagTotals.pcsReceived.toFixed(4)),
                                Number(materialBagTotals.balPcs.toFixed(4)),
                                Number(materialBagTotals.pcsLoss.toFixed(4))
                            ]);

                            totalRow.font = boldFont;
                            totalRow.fill = yellowFill;

                            totalRow.eachCell({ includeEmpty: true }, cell => {
                                cell.alignment = centerAlign;
                                cell.border = {
                                    top: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    left: { style: 'thin' },
                                    right: { style: 'thin' }
                                };
                            });

                            bagEndRow = totalRow.number;
                            currentRow++;
                        });

                        if (materialItemCount > 0 && bagStartRow < bagEndRow) {
                            bagMergeRanges.push({ start: bagStartRow, end: bagEndRow, col: 2 });
                            if (!deptStartRow) deptStartRow = bagStartRow;
                            deptEndRow = bagEndRow;
                        }
                    });

                    if (deptStartRow !== null && deptStartRow < deptEndRow) {
                        deptMergeRanges.push({ start: deptStartRow, end: deptEndRow, col: 1 });
                    }
                });

                // Apply merges
                deptMergeRanges.forEach(({ start, end, col }) => {
                    if (start < end) sheet.mergeCells(start, col, end, col);
                });
                bagMergeRanges.forEach(({ start, end, col }) => {
                    if (start < end) sheet.mergeCells(start, col, end, col);
                });

                // Grand Totals Section
                currentRow += 1;
                sheet.addRow([]);
                const grandHeader = sheet.addRow(["GRAND TOTAL BY DEPARTMENT AND MATERIAL"]);
                sheet.mergeCells(`A${currentRow}:S${currentRow}`);
                grandHeader.font = headingFont;
                grandHeader.alignment = centerAlign;
                // grandHeader.fill = blueFill;
                grandHeader.fill = blueFillStrong;
                currentRow += 2;
                sheet.addRow([]);

                const totalHeader = sheet.addRow([
                    "Department", "", "Material", "", "Qty", "To Issue", "In Bag", "Issued", "Received", "Balance Qty", "Loss Qty",
                    "Pcs", "Pcs Issued", "Pcs To Issue", "Pcs In Bag", "Pcs Received", "Balance Pcs", "Pcs Loss"
                ]);
                totalHeader.font = boldFont;
                // totalHeader.fill = grayFill;
                totalHeader.fill = blueFill;
                totalHeader.alignment = centerAlign;
                totalHeader.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });

                currentRow++;
                let lastDept = null;
                let deptStart = null;

                deptMaterialTotals.forEach((total, index) => {
                    const row = sheet.addRow([
                        total.department,
                        ,
                        total.material.toUpperCase(),
                        ,
                        Number(total.qty.toFixed(4)),
                        Number(total.toIssue.toFixed(4)),
                        Number(total.inBag.toFixed(4)),
                        Number(total.issued.toFixed(4)),
                        Number(total.received.toFixed(4)),
                        Number(total.balQty.toFixed(4)),
                        Number(total.lossQty.toFixed(4)),

                        Number(total.pcs.toFixed(4)),
                        Number(total.pcsIssued.toFixed(4)),
                        Number(total.pcsToIssue.toFixed(4)),
                        Number(total.pcsInBag.toFixed(4)),
                        Number(total.pcsReceived.toFixed(4)),
                        Number(total.balPcs.toFixed(4)),
                        Number(total.pcsLoss.toFixed(4))
                    ]);
                    row.eachCell(cell => {
                        cell.alignment = centerAlign;
                        cell.border = {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });

                    const rowNumber = row.number;
                    if (lastDept !== total.department) {
                        if (deptStart !== null && rowNumber - 1 > deptStart) {
                            sheet.mergeCells(`A${deptStart}:A${rowNumber - 1}`);
                        }
                        lastDept = total.department;
                        deptStart = rowNumber;
                    }
                    currentRow++;

                    if (index === deptMaterialTotals.length - 1 && deptStart !== null && rowNumber >= deptStart) {
                        sheet.mergeCells(`A${deptStart}:A${rowNumber}`);
                    }
                });

                // // Zebra striping for better clarity
                // for (let i = headerRow.number + 1; i <= sheet.lastRow.number; i++) {
                //     const row = sheet.getRow(i);
                //     if (i % 2 === 0) {
                //         row.fill = {
                //             type: 'pattern',
                //             pattern: 'solid',
                //             fgColor: { argb: 'F3F4F6' }
                //         };
                //     }
                // }

                // Format column widths
                sheet.columns.forEach(col => {
                    let maxLen = 6;
                    col.eachCell?.((cell) => {
                        const len = String(cell.value || '').length;
                        if (len > maxLen) maxLen = len;
                    });
                    col.width = Math.min(maxLen, 15);
                });

                // Uniform row height & font
                sheet.eachRow(row => {
                    row.height = 16;
                    row.font = { name: 'Calibri', size: 10 };
                });

                // Freeze header view
                sheet.views = [
                    { state: 'frozen', ySplit: headerRow.number }
                ];

                const buffer = await workbook.xlsx.writeBuffer();
                saveAs(
                    new Blob([buffer], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }),
                    `all_bag_data_${timestamp}.xlsx`
                );
            } catch (error) {
                console.error("Error downloading Excel file:", error);
                toast.error("Failed to download Excel file", { position: "top" });
            }
        };

        const processEmployees = async () => {
            try {
                regularEmployees.value = []; // Reset the final list
                const seen = new Set();

                // If a department is selected, only use that one
                if (selectedDepartment.value) {
                    const deptId = selectedDepartment.value;
                    const employeesInDept = listEmployees.value[deptId] || [];

                    employeesInDept.forEach(emp => {
                        if (!seen.has(emp.value)) {
                            seen.add(emp.value);
                            regularEmployees.value.push(emp);
                        }
                    });
                } else {
                    // No department selected: collect all employees across departments
                    Object.values(listEmployees.value).forEach(empArray => {
                        empArray.forEach(emp => {
                            if (!seen.has(emp.value)) {
                                seen.add(emp.value);
                                regularEmployees.value.push(emp);
                            }
                        });
                    });
                }
                // Reset selectedEmployee if it's not in the list
                const isValid = regularEmployees.value.some(emp => emp.value == selectedEmployee.value);
                if (!isValid) {
                    selectedEmployee.value = ''; // Or null, based on your empty state preference
                }
            } catch (error) {
                console.error('Error processing employees:', error);
            }
        };


        const isAllSelected = computed(() =>
            bags.value?.length > 0 &&
            selectedBags.value.length === bags.value.length
        );

        const isIndeterminate = computed(() =>
            selectedBags.value.length > 0 &&
            selectedBags.value.length < bags.value.length
        );

        const toggleSelectAll = () => {
            if (isAllSelected.value) {
                selectedBags.value = [];
            } else {
                selectedBags.value = bags.value.map(b => b.bag_no_id?.value);
            }
        };

        // Handle click outside dropdown to close it
        const handleClickOutside = (event) => {
            // Check if click is inside the department dropdown container
            if (departmentDropdownRef.value && !departmentDropdownRef.value.contains(event.target)) {
                showDepartmentDropdown.value = false;
            }
        };

        //Remove event listener when unmounted
        onUnmounted(() => {
            window.removeEventListener("keyup", handleKeyPress);
            document.removeEventListener('click', handleClickOutside);
        });

        // Lifecycle Hooks
        onMounted(async () => {
            await fetchDepartments();
            await getDepartmentEmployeesMap({ departments: departments.value.map(dept => dept.value) });
            console.log("Regular Employees", listEmployees.value);
            await processEmployees();
            console.log("props", props);
            if (props.workOrderName) {
                searchTerm.value = props.workOrderName;
                previousSearchTerm.value = props.workOrderName;
            }
            console.log("Props data", { selectedDepartment: selectedDepartment.value, isAdmin: userStore.isAdmin, searchTerm: searchTerm.value });
            selectSidebar(selectedSidebar.value, true);
            window.addEventListener("keyup", handleKeyPress);
            document.addEventListener('click', handleClickOutside);
        });

        return {
            sidebarItems,
            bagTabs,
            selectedSidebar,
            selectedTab,
            bagsToMove,
            bagsToAcknowledge,
            selectSidebar,
            selectTab,

            // Data
            totalItems,
            itemsPerPage,
            shortItemsPerPage,
            currentPage,
            selectedDepartment,
            showDepartmentDropdown,
            departmentDropdownRef,
            loadingMaterialSummary,
            searchTerm,
            noResultsFound,
            bags,
            components,
            departments,
            overdueDays,
            selectedBagName,
            selectedBagId,
            selectedDate,
            regularEmployees,
            selectedEmployee,

            // Computed
            totalPages,
            columnTotals,

            // Methods
            changePage,
            // isBagSelected,
            // handleSelectionChange,
            handleSearchInput,
            filterResults,
            fetchDepartments,
            fetchActiveBags,
            fetchActiveBagsForOverdue,
            // fetchBagComponents,
            fetchBagToMove,
            fetchSpecificMaterialDetails,
            fetchRejectedBags,
            getCardColor,
            printPDF,
            handleKeydown,
            triggerFetchOverdueBags,
            printAllBagsData,

            // API Status
            loading,
            error,
            loadingMaterialDetails,

            // Bag Details
            showMaterialDetailsPopUp,
            placeholderImage,
            openBagDetails,
            closeBagDetails,

            loadingBags,
            bagToMoveList,
            bagsToAcknowledgeList,
            specificMaterialDetailsList,
            bagsRejectedList,
            bagsOverdueList,
            // isAdmin,
            userStore,
            isPopupOpen,
            imageUrl,
            // openPopup,
            // closePopup,
            bagImageId,
            printFilteredBags,

            openImage,
            showImg,
            handleImageClose,
            currentImageUrl,

            selectedBags,
            isIndeterminate,
            isAllSelected,
            toggleSelectAll,
            localTotalGoldWeight,
            localTotalDiamondWeight,
            localTotalColorStoneWeight,
            materialSummary,
            jewellerySummaryData,
            jewelleryByQualityColor,
            loadingJewellerySummary,
            allBagMaterials,
            isJewelleryOpen,
            qualityColorSummary,
            // allBagMaterials, 
            bagAssemblyQualityColorMap,
            showMaterialSummaryTable,
            showQualityColorTable,
            fetchAllBagMaterials,
            fetchQualityColorFromBags,
            getBagWeights,
            toggleDepartment,
            removeDepartment,
        };
    },
};
</script>

<style scoped>
/* Ensure the modal has a fixed max height and becomes scrollable */
.modal-content {
    max-height: 80vh;
    /* Limit modal height to 80% of viewport */
    overflow-y: auto;
    /* Enable vertical scrolling */
    padding: 16px;
}

/* Ensure table inside modal is also scrollable */
.modal-table-container {
    max-height: 60vh;
    /* Table takes max 60% of viewport height */
    overflow-y: auto;
    /* Enable vertical scrolling */
}

.content-layout {
    display: flex;

}

.sidebar {
    width: 20%;
    /* Fixed width */
    padding: 15px;
    border-radius: 10px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    /* Prevent sidebar from shrinking */
}

.content {
    flex-grow: 1;
    /* Ensures the content takes the remaining space */
    min-width: 0;

    /* Prevents overflow issues */
    padding: 1rem;
    padding-right: 0;
}

/* .sidebar {
    /* width: 100%; */
/* Fixed width */
/* min-height: 100%; */
/* Full height */
/* padding: 1rem;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    flex-shrink: 0; */
/* Prevents shrinking */
/* } */
.sidebar-card {
    background-color: white;
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    overflow: hidden;
}

/* Container inside each card */
.sidebar-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 45px;
    border-radius: 8px;
    overflow: hidden;
    justify-content: space-between;
    /* Pushes text left, icon right */
}

/* Left Text Section (Flexible) */
.sidebar-text {
    flex-grow: 1;
    /* Allows text to expand */
    padding-left: 14px;
    /* Spacing from left */
    font-size: 13px;
    color: #333;
}

/* Right Fixed Icon Section */
.sidebar-icon {
    width: 50px;
    /* Fixed width */
    min-width: 50px;
    /* Prevents shrinking */
    height: 100%;
    background-color: #ffffff;
    /* Soft gray */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
}

/* Keep the icon background consistent for active state */
.sidebar-card.active .sidebar-icon {
    background-color: #6f7175;
    color: rgb(255, 255, 255);
}

/* Hover & Active Effects */
.sidebar-card:hover {
    transform: translateY(-2px);
    background-color: #f8f9fa;
}

.sidebar-card.active {
    background-color: #c6cacc;
    color: white;
    font-weight: 1000;
}

/* 🔹 Hover Animation for Sidebar & Tabs */
.tab-button,
.sidebar-card {
    transition: all 0.5s ease-in-out;
}

/* Slide & Fade Effect */
.tab-button:hover,
.sidebar-card:hover {
    opacity: 1;
    transform: translateY(-5px);
    /* Slight lift effect */
}

/* Active state effect */
.sidebar-card.active,
.tab-button.active {
    transform: translateY(0);
    /* Prevents active tabs from lifting */
}

/* Hide initially */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.tab-button {
    display: flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    transition: 0.3s;
    background-color: white;
    border: .5px solid #ddd;
    cursor: pointer;
    width: 100%;
}

.tab-button:hover {
    background-color: #f8f9fa;
}

.tab-button.active {
    background-color: #c6cacc;
    color: white;
    font-weight: 1000;
}

/* Left Colored Section */
.tab-icon {
    width: 35px;
    height: 100%;
    background-color: #ffffff;
    /* Soft gray */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
}



.tab-button.active .tab-icon {
    background-color: #6f7175;
    /* Darker color for active */
    color: white;
}

/* Right Text Section */
.tab-text {
    padding: 8px 10px;
    font-size: 13px;
    color: #333;
    width: 100%;

}



.tab-content h2 {
    margin-bottom: 12px;
}

.tab-content ul {
    list-style: none;
    padding: 0;
}

.table {
    border-collapse: collapse;
    width: 100%;
}

.table th,
.table td {
    text-align: left;
    padding: 8px;
    border: 1px solid #ddd;
}

/* For image popup */
/* Fade-in / Fade-out Animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.disabled-tab {
    opacity: 0.5;
    pointer-events: none;
    /* Prevents interaction */
    transition: opacity 0.1s ease;
}
</style>