"use strict";
const Git = require('../src/lib/git');
const GitPackage = require('../src/lib/git-package');
const simple = require('simple-mock');
const expect = require('chai').expect;

const testPackageRoot = '/absolute/path/to/repo';

class FakeRepository {
    constructor(packageRoot){
        this.packageRoot = packageRoot;
    }
}

describe('GitPackage', function(){

    before(function(){
        simple.mock(Git, 'createRepository', (packageRoot) => new FakeRepository(packageRoot));
    });

    it('contains the right properties', () => {
        const gitPackage = new GitPackage(testPackageRoot)
        const expectedRepository = Git.createRepository(testPackageRoot);

        expect(gitPackage.basename).to.equal('repo');
        expect(gitPackage.path).to.equal(testPackageRoot);
        expect(gitPackage.git).to.eql(expectedRepository);
    });

    after(function(){
        simple.restore();
    })
})