function test(suite) {
	
	function invoke(test, suite) {
		try {
			var context = {}, chain = [];
			while (suite) {
				chain.unshift(suite);
				suite = suite._parent;
			}
			for (var i = 0; i < chain.length; i++) {
				if (chain[i]._setup) chain[i]._setup.apply(context);
			}
			test.apply(context);
			for (var i = chain.length - 1; i >= 0; i--) {
				if (chain[i]._tearDown) chain[i]._tearDown.apply(context);
			}
		} catch (error) {
			print("Whoops: " + error);
		}
	}
	
	for (var k in suite) {
		if (k.charAt(0) == '_') continue;
		if (typeof suite[k] == 'function') {
			invoke(suite[k], suite);
		} else if (typeof suite[k] == 'object') {
			suite[k]._parent = suite;
			test(suite[k]);
		}
	}
	
};

function assert(condition, msg) {
	if (!condition) throw msg || "Assertion failed";
}

function assertEqual(e, a, msg) {
	assert(a == e, msg);
};
