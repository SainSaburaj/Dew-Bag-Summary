import { ref } from "vue";
import { generateEndPoint, unwrapInEscapedBody } from "@/utils/apiHelpers";

const END_POINTS = {
  // List Active Bags
  LIST_ACTIVE_BAGS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listActiveBags",
    name: "LIST_ACTIVE_BAGS",
  },
  // List Departments
  LIST_DEPARTMENTS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listDepartments",
    name: "LIST_DEPARTMENTS",
  },
  // List Bag Components
  LIST_BAG_COMPONENTS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listBagComponents",
    name: "LIST_BAG_COMPONENTS",
  },
  // List Bag To Move
  LIST_BAG_TO_MOVE: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listBagToMove",
    name: "LIST_BAG_TO_MOVE",
  },
  // List Bags To Acknowledge
  LIST_BAG_TO_ACKNOWLEDGE: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listBagMovementDetails",
    name: "LIST_BAG_TO_ACKNOWLEDGE",
  },
  // List Bag Metal Type Details
  LIST_SPECIFIC_MATERIAL_DETAILS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listSpecificMaterialDetails",
    name: "LIST_SPECIFIC_MATERIAL_DETAILS",
  },
  // List Rejected Bags
  LIST_REJECTED_BAGS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listRejectedBags",
    name: "LIST_REJECTED_BAGS",
  },
  // List Overdue Bags
  LIST_OVERDUE_BAGS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listOverdueBags",
    name: "LIST_OVERDUE_BAGS",
  },

  LIST_DEPT_ISSUES: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listDeptIssues",
    name: "LIST_DEPT_ISSUES",
  },

  // Generate PDF
  GENERATE_PDF: {
    endpointName: "PDF_APP_ENDPOINT",
    apiType: "printpdf",
    name: "GENERATE_PDF",
  },
  // List Employees
  LIST_DEPARTMENTS_EMPLOYEES: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "getDepartmentEmployeesMap",
    name: "LIST_DEPARTMENTS_EMPLOYEES",
  },
  // List All Bags Data
  LIST_ALL_BAGS_DATA: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "listAllBagsData",
    name: "LIST_ALL_BAGS_DATA",
  },
  // Get Total Material Weights (Gold, Diamond, Color Stone)
  GET_TOTAL_MATERIAL_WEIGHTS: {
    endpointName: "BAG_REPORTS_APP_ENDPOINT",
    apiType: "getTotalMaterialWeights",
    name: "GET_TOTAL_MATERIAL_WEIGHTS",
  },
};

export function useAllBagSummaryApi() {
  const loading = ref(false);
  const error = ref(null);
  const loadingBags = ref(false);
  const listDepartments = ref([]);
  const listActiveBags = ref([]);
  const bagComponentsList = ref([]);
  const loadingComponents = ref(false);
  const bagToMoveListObj = ref([]);
  const bagsToAcknowledgeListobj = ref([]);
  const loadingMaterialDetails = ref(false);
  const specificMaterialDetailsList = ref([]);
  const bagsRejectedListObj = ref([]);
  const bagsOverdueListObj = ref([]);
  const listDepartmentsIssues = ref([]);
  const listEmployees = ref({});
  const allBagData = ref([]);
  const totalMaterialWeights = ref({
    goldWeight: 0,
    diamondWeight: 0,
    colorStoneWeight: 0
  });

  const fetchListActiveBags = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_ACTIVE_BAGS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        listActiveBags.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const fetchListBagComponents = async (data) => {
    try {
      loadingComponents.value = true;
      error.value = null;
      const endpoint = "LIST_BAG_COMPONENTS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        bagComponentsList.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingComponents.value = false;
    }
  };

  const fetchListBagToMove = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_BAG_TO_MOVE";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        bagToMoveListObj.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const fetchListBagsToAcknowledge = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_BAG_TO_ACKNOWLEDGE";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        bagsToAcknowledgeListobj.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const fetchListRejectedBags = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_REJECTED_BAGS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        bagsRejectedListObj.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const fetchListOverdueBags = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_OVERDUE_BAGS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        bagsOverdueListObj.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const fetchListDepartments = async (data) => {
    try {
      loading.value = true;
      error.value = null;
      const endpoint = "LIST_DEPARTMENTS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        listDepartments.value = responseJson.data;
      } else {
        throw new Error(responseJson.reason || "Failed to fetch departments");
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching departments:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchListSpecificMaterialDetails = async (data) => {
    try {
      loadingMaterialDetails.value = true;
      error.value = null;
      const endpoint = "LIST_SPECIFIC_MATERIAL_DETAILS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        specificMaterialDetailsList.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch active generated bags"
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching acyive generated bags:", err);
    } finally {
      loadingMaterialDetails.value = false;
    };
  };

  const generatePDFWithInternalId = async (data) => {
    try {
      const endpoint = "GENERATE_PDF"; // Use the correct key for the endpoint

      // Assuming generateEndPoint constructs the URL correctly
      const pdfUrl = generateEndPoint(endpoint, END_POINTS, data);

      // Open the generated URL in a new tab
      const newWindow = window.open(pdfUrl, "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    } catch (error) {
      console.error("Error generating PDF with internal ID:", error);
      throw error;
    }


  };
  const fetchListDeptIssues = async (data) => {
    try {
      loading.value = true;
      error.value = null;
      const endpoint = "LIST_DEPT_ISSUES";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        listDepartmentsIssues.value = responseJson.data;
      } else {
        throw new Error(responseJson.reason || "Failed to fetch departments");
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching departments:", err);
    } finally {
      loading.value = false;
    }
  };

  const getDepartmentEmployeesMap = async (data) => {
    try {
      loading.value = true;
      error.value = null;
      const endpoint = "LIST_DEPARTMENTS_EMPLOYEES";
      const requestData = data;
      console.log("requestData", requestData);
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: {},
        body: JSON.stringify(requestData),
      });
      const responseJson = await response.json();
      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        listEmployees.value = responseJson.data;
      } else {
        throw new Error(responseJson.message || "Failed to fetching regular employees");
      }
    } catch (err) {
      if (err.response?.data) {
        const errorDetails = decodeURIComponent(err.response.data);
        console.error("Decoded Backend Error:", errorDetails);
      }
      error.value = err.message;
      console.error("Error fetching regular employees:", err);
    } finally {
      loading.value = false;
    }
  };

  const getAllBagData = async (data) => {
    try {
      loadingBags.value = true;
      error.value = null;
      const endpoint = "LIST_ALL_BAGS_DATA";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data
      ) {
        responseJson.data = unwrapInEscapedBody(responseJson.data);
        allBagData.value = responseJson.data;
      } else {
        throw new Error(
          responseJson.reason || "Failed to fetch all bags data."
        );
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching all bags data:", err);
    } finally {
      loadingBags.value = false;
    }
  };

  const getTotalMaterialWeights = async (data) => {
    try {
      error.value = null;
      console.log("getTotalMaterialWeights composable called with data:", data);
      const endpoint = "GET_TOTAL_MATERIAL_WEIGHTS";
      const response = await fetch(generateEndPoint(endpoint, END_POINTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("getTotalMaterialWeights response status:", response.status);
      const responseJson = await response.json();
      console.log("getTotalMaterialWeights responseJson:", responseJson);

      if (
        responseJson &&
        responseJson.status === "SUCCESS" &&
        responseJson.data !== undefined
      ) {
        let unwrappedData = responseJson.data;
        if (typeof unwrappedData === 'string') {
          unwrappedData = unwrapInEscapedBody(unwrappedData);
        }
        totalMaterialWeights.value = unwrappedData;
        console.log("totalMaterialWeights.value set to:", totalMaterialWeights.value);
      } else {
        totalMaterialWeights.value = {
          goldWeight: 0,
          diamondWeight: 0,
          colorStoneWeight: 0
        };
        console.log("Response not successful, setting totalMaterialWeights to defaults");
      }
    } catch (err) {
      error.value = err.message;
      totalMaterialWeights.value = {
        goldWeight: 0,
        diamondWeight: 0,
        colorStoneWeight: 0
      };
      console.error("Error fetching total material weights:", err);
    }
  };

  return {
    listDepartments,
    listActiveBags,
    bagComponentsList,
    bagToMoveListObj,
    bagsRejectedListObj,
    bagsOverdueListObj,
    bagsToAcknowledgeListobj,
    loading,
    loadingComponents,
    loadingMaterialDetails,
    specificMaterialDetailsList,
    loadingBags,
    error,
    listDepartmentsIssues,
    listEmployees,
    allBagData,
    totalMaterialWeights,

    fetchListDepartments,
    fetchListActiveBags,
    fetchListBagComponents,
    fetchListBagToMove,
    fetchListBagsToAcknowledge,
    fetchListSpecificMaterialDetails,
    fetchListRejectedBags,
    fetchListOverdueBags,
    generatePDFWithInternalId,
    fetchListDeptIssues,
    getDepartmentEmployeesMap,
    getAllBagData,
    getTotalMaterialWeights,
  };
}
