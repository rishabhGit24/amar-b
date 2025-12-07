"""
Plan Validation Utilities for AMAR MVP
Provides comprehensive validation for plan structure and content
Validates: Requirements 2.3, 2.4
"""

from typing import Dict, List, Set, Any
from pydantic import ValidationError

from models.core import Plan, PageSpec, ComponentSpec, RoutingConfig, BackendSpec


class PlanValidator:
    """
    Comprehensive validator for plan structure and content
    
    Ensures plans contain all required fields, have consistent routing,
    and meet all structural requirements before storage.
    
    Validates: Requirements 2.3, 2.4
    """
    
    def __init__(self):
        """Initialize plan validator"""
        self.required_page_fields = {'name', 'route', 'components', 'description'}
        self.required_component_fields = {'name', 'type', 'description'}
        self.required_routing_fields = {'base_path', 'routes'}
        self.valid_component_types = {'functional', 'class', 'hook'}
        self.valid_complexity_levels = {'simple', 'medium', 'complex'}
    
    def validate_plan_structure(self, plan: Plan) -> Dict[str, Any]:
        """
        Validate complete plan structure and return validation report
        
        Args:
            plan: Plan object to validate
            
        Returns:
            Dictionary with validation results and any issues found
        """
        validation_report = {
            'valid': True,
            'errors': [],
            'warnings': [],
            'summary': {}
        }
        
        try:
            # Validate pages
            page_validation = self._validate_pages(plan.pages)
            validation_report['errors'].extend(page_validation['errors'])
            validation_report['warnings'].extend(page_validation['warnings'])
            
            # Validate components
            component_validation = self._validate_components(plan.components)
            validation_report['errors'].extend(component_validation['errors'])
            validation_report['warnings'].extend(component_validation['warnings'])
            
            # Validate routing consistency
            routing_validation = self._validate_routing_consistency(plan.pages, plan.routing)
            validation_report['errors'].extend(routing_validation['errors'])
            validation_report['warnings'].extend(routing_validation['warnings'])
            
            # Validate component references
            reference_validation = self._validate_component_references(plan.pages, plan.components)
            validation_report['errors'].extend(reference_validation['errors'])
            validation_report['warnings'].extend(reference_validation['warnings'])
            
            # Validate backend logic if present
            if plan.backend_logic:
                backend_validation = self._validate_backend_logic(plan.backend_logic)
                validation_report['errors'].extend(backend_validation['errors'])
                validation_report['warnings'].extend(backend_validation['warnings'])
            
            # Validate complexity assessment
            complexity_validation = self._validate_complexity(plan)
            validation_report['warnings'].extend(complexity_validation['warnings'])
            
            # Set overall validity
            validation_report['valid'] = len(validation_report['errors']) == 0
            
            # Generate summary
            validation_report['summary'] = self._generate_validation_summary(plan)
            
        except Exception as e:
            validation_report['valid'] = False
            validation_report['errors'].append(f"Validation process failed: {str(e)}")
        
        return validation_report
    
    def _validate_pages(self, pages: List[PageSpec]) -> Dict[str, List[str]]:
        """Validate page specifications"""
        errors = []
        warnings = []
        
        if not pages:
            errors.append("Plan must contain at least one page")
            return {'errors': errors, 'warnings': warnings}
        
        if len(pages) > 5:
            errors.append(f"Page count ({len(pages)}) exceeds maximum of 5 pages")
        
        # Check for duplicate page names and routes
        page_names = set()
        page_routes = set()
        
        for i, page in enumerate(pages):
            # Check for required fields (already validated by Pydantic, but double-check)
            if not page.name or not page.name.strip():
                errors.append(f"Page {i+1}: Name cannot be empty")
            
            if not page.route or not page.route.strip():
                errors.append(f"Page {i+1}: Route cannot be empty")
            
            # Check for duplicates
            if page.name in page_names:
                errors.append(f"Duplicate page name: {page.name}")
            page_names.add(page.name)
            
            if page.route in page_routes:
                errors.append(f"Duplicate page route: {page.route}")
            page_routes.add(page.route)
            
            # Validate route format
            if not page.route.startswith('/'):
                warnings.append(f"Page {page.name}: Route should start with '/' (got: {page.route})")
            
            # Check component references
            if not page.components:
                warnings.append(f"Page {page.name}: No components specified")
        
        return {'errors': errors, 'warnings': warnings}
    
    def _validate_components(self, components: List[ComponentSpec]) -> Dict[str, List[str]]:
        """Validate component specifications"""
        errors = []
        warnings = []
        
        if not components:
            warnings.append("No components specified in plan")
            return {'errors': errors, 'warnings': warnings}
        
        # Check for duplicate component names
        component_names = set()
        
        for i, component in enumerate(components):
            # Check for required fields
            if not component.name or not component.name.strip():
                errors.append(f"Component {i+1}: Name cannot be empty")
            
            if component.type not in self.valid_component_types:
                errors.append(f"Component {component.name}: Invalid type '{component.type}'. Must be one of: {self.valid_component_types}")
            
            # Check for duplicates
            if component.name in component_names:
                errors.append(f"Duplicate component name: {component.name}")
            component_names.add(component.name)
            
            # Validate component naming convention
            if not component.name[0].isupper():
                warnings.append(f"Component {component.name}: Should start with uppercase letter (React convention)")
        
        return {'errors': errors, 'warnings': warnings}
    
    def _validate_routing_consistency(self, pages: List[PageSpec], routing: RoutingConfig) -> Dict[str, List[str]]:
        """Validate routing configuration consistency with pages"""
        errors = []
        warnings = []
        
        # Get all page routes and names
        page_routes = {page.route for page in pages}
        page_names = {page.name for page in pages}
        
        # Check that all routes in routing config correspond to actual pages
        routing_paths = {route['path'] for route in routing.routes}
        routing_components = {route['component'] for route in routing.routes}
        
        # Check for missing routes
        missing_routes = page_routes - routing_paths
        if missing_routes:
            errors.append(f"Routes missing from routing config: {missing_routes}")
        
        # Check for extra routes
        extra_routes = routing_paths - page_routes
        if extra_routes:
            warnings.append(f"Extra routes in routing config not matching any page: {extra_routes}")
        
        # Check for missing components
        missing_components = routing_components - page_names
        if missing_components:
            errors.append(f"Routing references non-existent page components: {missing_components}")
        
        # Validate navigation links
        if routing.navigation_links:
            nav_paths = {link['path'] for link in routing.navigation_links}
            invalid_nav_paths = nav_paths - page_routes
            if invalid_nav_paths:
                warnings.append(f"Navigation links reference non-existent routes: {invalid_nav_paths}")
        
        return {'errors': errors, 'warnings': warnings}
    
    def _validate_component_references(self, pages: List[PageSpec], components: List[ComponentSpec]) -> Dict[str, List[str]]:
        """Validate that page component references are valid"""
        errors = []
        warnings = []
        
        # Get all available component names
        available_components = {comp.name for comp in components}
        
        # Check each page's component references
        for page in pages:
            for component_name in page.components:
                if component_name not in available_components:
                    errors.append(f"Page {page.name} references undefined component: {component_name}")
        
        # Check for unused components
        used_components = set()
        for page in pages:
            used_components.update(page.components)
        
        unused_components = available_components - used_components
        if unused_components:
            warnings.append(f"Unused components defined: {unused_components}")
        
        return {'errors': errors, 'warnings': warnings}
    
    def _validate_backend_logic(self, backend: BackendSpec) -> Dict[str, List[str]]:
        """Validate backend logic specification"""
        errors = []
        warnings = []
        
        if not backend.endpoints:
            warnings.append("Backend logic specified but no endpoints defined")
            return {'errors': errors, 'warnings': warnings}
        
        # Check for duplicate endpoints
        endpoint_signatures = set()
        
        for endpoint in backend.endpoints:
            signature = f"{endpoint['method']} {endpoint['path']}"
            if signature in endpoint_signatures:
                errors.append(f"Duplicate endpoint: {signature}")
            endpoint_signatures.add(signature)
            
            # Validate endpoint format
            if not endpoint.get('path', '').startswith('/'):
                warnings.append(f"Endpoint path should start with '/': {endpoint.get('path')}")
            
            if endpoint.get('method') not in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
                warnings.append(f"Unusual HTTP method: {endpoint.get('method')}")
        
        return {'errors': errors, 'warnings': warnings}
    
    def _validate_complexity(self, plan: Plan) -> Dict[str, List[str]]:
        """Validate complexity assessment"""
        warnings = []
        
        if plan.estimated_complexity not in self.valid_complexity_levels:
            warnings.append(f"Invalid complexity level: {plan.estimated_complexity}")
        
        # Assess if complexity matches plan content
        page_count = len(plan.pages)
        component_count = len(plan.components)
        has_backend = plan.backend_logic is not None
        
        # Simple heuristics for complexity assessment
        if page_count <= 2 and component_count <= 5 and not has_backend:
            expected_complexity = 'simple'
        elif page_count <= 4 and component_count <= 15 and (not has_backend or len(plan.backend_logic.endpoints) <= 3):
            expected_complexity = 'medium'
        else:
            expected_complexity = 'complex'
        
        if plan.estimated_complexity != expected_complexity:
            warnings.append(f"Complexity assessment '{plan.estimated_complexity}' may not match plan content (expected: {expected_complexity})")
        
        return {'warnings': warnings}
    
    def _generate_validation_summary(self, plan: Plan) -> Dict[str, Any]:
        """Generate summary of plan validation"""
        return {
            'page_count': len(plan.pages),
            'component_count': len(plan.components),
            'route_count': len(plan.routing.routes),
            'has_backend': plan.backend_logic is not None,
            'backend_endpoint_count': len(plan.backend_logic.endpoints) if plan.backend_logic else 0,
            'complexity': plan.estimated_complexity,
            'navigation_links': len(plan.routing.navigation_links) if plan.routing.navigation_links else 0
        }


def validate_plan_completeness(plan_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate that plan dictionary contains all required fields
    
    Args:
        plan_dict: Dictionary containing plan data
        
    Returns:
        Validation report with errors and warnings
    """
    validator = PlanValidator()
    
    # Check for required top-level fields
    required_fields = {'pages', 'components', 'routing'}
    missing_fields = required_fields - set(plan_dict.keys())
    
    if missing_fields:
        return {
            'valid': False,
            'errors': [f"Missing required fields: {missing_fields}"],
            'warnings': [],
            'summary': {}
        }
    
    try:
        # Create Plan object to trigger Pydantic validation
        pages = [PageSpec(**page) for page in plan_dict['pages']]
        components = [ComponentSpec(**comp) for comp in plan_dict['components']]
        routing = RoutingConfig(**plan_dict['routing'])
        
        backend_logic = None
        if plan_dict.get('backend_logic'):
            backend_logic = BackendSpec(**plan_dict['backend_logic'])
        
        plan = Plan(
            pages=pages,
            components=components,
            routing=routing,
            backend_logic=backend_logic,
            estimated_complexity=plan_dict.get('estimated_complexity', 'simple')
        )
        
        # Run comprehensive validation
        return validator.validate_plan_structure(plan)
        
    except ValidationError as e:
        return {
            'valid': False,
            'errors': [f"Plan structure validation failed: {str(e)}"],
            'warnings': [],
            'summary': {}
        }
    except Exception as e:
        return {
            'valid': False,
            'errors': [f"Validation process failed: {str(e)}"],
            'warnings': [],
            'summary': {}
        }