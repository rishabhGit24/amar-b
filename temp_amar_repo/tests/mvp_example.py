"""
MVP Example: SQL Injection Fix
Demonstrates AMAR's ability to provide security patches with tests
"""

def generate_sql_injection_fix():
    """Generate patch for SQL injection vulnerability"""
    
    mvp_response = {
        "query": "Replace direct SQL string concatenation in file src/db/user.js to parameterized queries",
        
        "analysis": {
            "vulnerability": "SQL Injection via string concatenation",
            "severity": "CRITICAL",
            "affected_file": "src/db/user.js",
            "security_improvement": "Prevents SQL injection attacks by using parameterized queries"
        },
        
        "patch": """
--- a/src/db/user.js
+++ b/src/db/user.js
@@ -1,10 +1,12 @@
 const mysql = require('mysql');
+const connection = mysql.createConnection({
+  host: 'localhost',
+  user: 'root',
+  database: 'myapp'
+});
 
 // VULNERABLE CODE - DO NOT USE
-function getUserById(userId) {
-  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
-  return connection.query(query);
-}
+// function getUserById(userId) {
+//   const query = "SELECT * FROM users WHERE id = '" + userId + "'";
+//   return connection.query(query);
+// }
 
 // SECURE CODE - Use parameterized queries
 function getUserById(userId) {
   const query = "SELECT * FROM users WHERE id = ?";
   return new Promise((resolve, reject) => {
     connection.query(query, [userId], (error, results) => {
       if (error) reject(error);
       else resolve(results);
     });
   });
 }
 
 function getUserByEmail(email) {
-  const query = "SELECT * FROM users WHERE email = '" + email + "'";
-  return connection.query(query);
+  const query = "SELECT * FROM users WHERE email = ?";
+  return new Promise((resolve, reject) => {
+    connection.query(query, [email], (error, results) => {
+      if (error) reject(error);
+      else resolve(results);
+    });
+  });
 }
 
 function createUser(username, email, password) {
-  const query = "INSERT INTO users (username, email, password) VALUES ('" + 
-                username + "', '" + email + "', '" + password + "')";
-  return connection.query(query);
+  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
+  return new Promise((resolve, reject) => {
+    connection.query(query, [username, email, password], (error, results) => {
+      if (error) reject(error);
+      else resolve(results);
+    });
+  });
 }
 
 module.exports = { getUserById, getUserByEmail, createUser };
""",
        
        "unit_tests": """
// tests/db/user.test.js
const { getUserById, getUserByEmail, createUser } = require('../../src/db/user');
const mysql = require('mysql');

// Mock the mysql connection
jest.mock('mysql');

describe('User Database Functions - Security Tests', () => {
  let mockConnection;
  
  beforeEach(() => {
    mockConnection = {
      query: jest.fn()
    };
    mysql.createConnection.mockReturnValue(mockConnection);
  });
  
  describe('getUserById', () => {
    it('should use parameterized query to prevent SQL injection', async () => {
      const maliciousId = "1' OR '1'='1";
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [{ id: 1, username: 'test' }]);
      });
      
      await getUserById(maliciousId);
      
      // Verify parameterized query was used
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [maliciousId],
        expect.any(Function)
      );
    });
    
    it('should return user data for valid ID', async () => {
      const expectedUser = { id: 1, username: 'john', email: 'john@example.com' };
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [expectedUser]);
      });
      
      const result = await getUserById(1);
      expect(result).toEqual([expectedUser]);
    });
  });
  
  describe('getUserByEmail', () => {
    it('should use parameterized query for email lookup', async () => {
      const email = "test@example.com";
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });
      
      await getUserByEmail(email);
      
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = ?",
        [email],
        expect.any(Function)
      );
    });
  });
  
  describe('createUser', () => {
    it('should use parameterized query for user creation', async () => {
      const username = "newuser";
      const email = "new@example.com";
      const password = "hashedpassword";
      
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, { insertId: 1 });
      });
      
      await createUser(username, email, password);
      
      expect(mockConnection.query).toHaveBeenCalledWith(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        expect.any(Function)
      );
    });
    
    it('should prevent SQL injection in username field', async () => {
      const maliciousUsername = "admin'; DROP TABLE users; --";
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, { insertId: 1 });
      });
      
      await createUser(maliciousUsername, "test@test.com", "pass");
      
      // Verify the malicious input is passed as parameter, not concatenated
      const callArgs = mockConnection.query.mock.calls[0];
      expect(callArgs[1]).toContain(maliciousUsername);
      expect(callArgs[0]).not.toContain(maliciousUsername);
    });
  });
});
""",
        
        "commands": {
            "install_dependencies": "npm install --save-dev jest",
            "run_tests": "npm test -- tests/db/user.test.js",
            "run_all_tests": "npm test",
            "coverage": "npm test -- --coverage"
        },
        
        "security_improvements": [
            "✓ Eliminated SQL injection vulnerability",
            "✓ Used parameterized queries (prepared statements)",
            "✓ Input is treated as data, not executable code",
            "✓ Works with all special characters and quotes",
            "✓ No need for manual escaping"
        ],
        
        "required_reviewers": [
            "Security Team Lead",
            "Backend Team Lead",
            "DevOps Engineer (for deployment)"
        ],
        
        "deployment_checklist": [
            "[ ] Code review approved by security team",
            "[ ] All unit tests passing",
            "[ ] Integration tests updated",
            "[ ] Security scan completed",
            "[ ] Staging deployment tested",
            "[ ] Production deployment scheduled"
        ]
    }
    
    return mvp_response


def print_mvp_response():
    """Print formatted MVP response"""
    response = generate_sql_injection_fix()
    
    print("="*70)
    print("AMAR MVP - SQL Injection Fix")
    print("="*70)
    
    print(f"\nQuery: {response['query']}")
    
    print("\n" + "="*70)
    print("ANALYSIS")
    print("="*70)
    for key, value in response['analysis'].items():
        print(f"{key.replace('_', ' ').title()}: {value}")
    
    print("\n" + "="*70)
    print("PATCH (DIFF)")
    print("="*70)
    print(response['patch'])
    
    print("\n" + "="*70)
    print("UNIT TESTS")
    print("="*70)
    print(response['unit_tests'])
    
    print("\n" + "="*70)
    print("COMMANDS TO RUN")
    print("="*70)
    for cmd_name, cmd in response['commands'].items():
        print(f"{cmd_name}: {cmd}")
    
    print("\n" + "="*70)
    print("SECURITY IMPROVEMENTS")
    print("="*70)
    for improvement in response['security_improvements']:
        print(improvement)
    
    print("\n" + "="*70)
    print("REQUIRED REVIEWERS")
    print("="*70)
    for reviewer in response['required_reviewers']:
        print(f"- {reviewer}")
    
    print("\n" + "="*70)
    print("DEPLOYMENT CHECKLIST")
    print("="*70)
    for item in response['deployment_checklist']:
        print(item)


if __name__ == "__main__":
    print_mvp_response()
