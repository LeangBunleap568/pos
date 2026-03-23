const isValid = (value) => {
    // work when true
    // if use not input
    if (value == undefined || value == "" || value == null) {
        return true
    }
    // ក្នុង JavaScript ប្រសិនបើ Function មួយដំណើរការចប់ ហើយវារកមិនឃើញពាក្យ return ទេ វានឹងផ្តល់តម្លៃមកវិញជា undefined ដោយស្វ័យប្រវត្តិ។
    return false
}
module.exports = {
    isValid
}